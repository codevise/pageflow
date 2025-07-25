module Pageflow
  # Service object for copying nested revision components between
  # records using bulk INSERT ... SELECT statements.
  #
  # When `reset_perma_ids` is false we reuse the perma_id values from the
  # source revision. Parents and their copies are joined via perma_id so that
  # foreign keys of the newly inserted records point at the duplicated parents.
  #
  # If `reset_perma_ids` is true we compute an offset for each
  # association. The offset ensures that the minimum perma_id of the
  # records being copied becomes `entry.perma_id_counter + 1`. This
  # yields a range of new perma_ids above the current maximum perma_id
  # of the entry while preserving the relative order of ids within the
  # copied set.
  #
  # Example for a simple one level association:
  #
  #   INSERT INTO test_nested_revision_components (parent_id, perma_id, text)
  #   SELECT NEW_ROOT_ID, old_items.perma_id + OFFSET, old_items.text
  #   FROM test_nested_revision_components AS old_items
  #   WHERE old_items.parent_id = OLD_ROOT_ID;
  #
  # Example for a deeply nested association where nested items have parents of
  # the same type:
  #
  #   INSERT INTO test_deeply_nested_revision_components (parent_id, perma_id)
  #   SELECT new_children.id,
  #          old_deep_items.perma_id + OFFSET,
  #          old_deep_items.text
  #   FROM test_deeply_nested_revision_components AS old_deep_items
  #   JOIN test_nested_revision_components AS old_children
  #     ON old_children.id = old_deep_items.parent_id
  #   JOIN test_nested_revision_components AS new_children
  #     ON new_children.parent_id = NEW_ROOT_ID
  #    AND new_children.perma_id = old_children.perma_id + CHILD_OFFSET
  #   WHERE old_children.parent_id = OLD_ROOT_ID;
  class NestedRevisionComponentCopy
    def initialize(from:, to:, reset_perma_ids: false, connection: ActiveRecord::Base.connection)
      @root_class = from.class
      @old_root_id = from.id
      @new_root_id = to.id

      @reset_perma_ids = reset_perma_ids
      @connection = connection

      @offsets = Hash.new(0)
      @entry = to.entry_for_auto_generated_perma_id
    end

    def perform_for(revision_components:)
      perform(Model.for(revision_components:))
    end

    def perform_for_nested_revision_components
      perform(Model.for_nested_revision_components(@root_class))
    end

    private

    def perform(models)
      lock_entry_if_resetting_perma_ids do
        @entry_counter = @entry.perma_id_counter
        copy_all(models)

        update_perma_id_counter_if_changed
      end
    end

    def lock_entry_if_resetting_perma_ids(&block)
      if @reset_perma_ids
        @entry.with_lock(&block)
      else
        block.call
      end
    end

    def update_perma_id_counter_if_changed
      return unless @entry_counter != @entry.perma_id_counter

      @entry.update!(perma_id_counter: @entry_counter)
    end

    def copy_all(models, chain: [])
      models.each do |model|
        compute_offset(model, chain)
        bulk_insert(model, chain)

        copy_all(model.nested_models,
                 chain: chain + [model])
      end
    end

    def compute_offset(model, chain)
      return nil unless @reset_perma_ids

      # When resetting perma_ids, shift old ids so the smallest
      # becomes entry.perma_id_counter + 1. Example: current_max = 10,
      # old perma ids=[3, 5] results in offset 10 - 3 + 1 = 8 and
      # hence new ids [11, 13].
      min_perma_id, max_perma_id = get_min_max_perma_id(model, chain)

      return nil unless min_perma_id

      offset = @entry_counter - min_perma_id + 1

      @entry_counter = max_perma_id + offset
      @offsets[model] = offset
    end

    def get_min_max_perma_id(model, chain)
      row = @connection.select_one(<<-SQL.squish)
        SELECT MIN(#{model.old_table_alias}.#{model.perma_id_column}) AS min_perma_id,
               MAX(#{model.old_table_alias}.#{model.perma_id_column}) AS max_perma_id
        FROM #{model.table_name} AS #{model.old_table_alias}
        #{join_old_parents(model, chain)}
        WHERE #{where_belongs_to_old_root(model, chain)}
      SQL

      return nil unless row && row['min_perma_id']

      [row['min_perma_id'].to_i, row['max_perma_id'].to_i]
    end

    def bulk_insert(model, chain)
      @connection.execute(<<~SQL.squish)
        INSERT INTO #{model.table_name} (#{model.insert_list})
        SELECT #{select_with_new_foreign_key_value(model, chain)}
        FROM #{model.table_name} AS #{model.old_table_alias}
        #{join_old_parents(model, chain)}
        #{join_new_parents(chain)}
        WHERE #{where_belongs_to_old_root(model, chain)}
      SQL
    end

    def select_with_new_foreign_key_value(model, chain)
      model.select_list(
        new_foreign_key_value: chain.empty? ? @new_root_id : chain.last.new_id,
        perma_id_offset: @offsets[model]
      )
    end

    def join_old_parents(model, chain)
      [*chain, model].reverse_each.each_cons(2).map { |child, parent|
        parent.join_as_old_on(id_value: child.old_foreign_key)
      }.join("\n")
    end

    def join_new_parents(chain)
      return '' if chain.empty?

      [
        chain.first.join_as_new_on_matching_perma_id(
          foreign_key_value: @new_root_id,
          perma_id_offset: @offsets[chain.first]
        ),
        *chain.each_cons(2).map do |parent, child|
          child.join_as_new_on_matching_perma_id(
            foreign_key_value: parent.new_id,
            perma_id_offset: @offsets[child]
          )
        end
      ].join("\n")
    end

    def where_belongs_to_old_root(model, chain)
      "#{[*chain, model].first.old_foreign_key} = #{@old_root_id}"
    end

    Model = Struct.new(:klass, :foreign_key, :level, keyword_init: true) do
      def self.for(revision_components:)
        revision_components.map do |revision_component|
          Model.new(klass: revision_component, foreign_key: 'revision_id', level: 1)
        end
      end

      def self.for_nested_revision_components(klass, level: 1)
        klass.nested_revision_component_collection_names.map do |collection_name|
          reflection = klass.reflect_on_association(collection_name)
          Model.new(klass: reflection.klass, foreign_key: reflection.foreign_key, level:)
        end
      end

      def nested_models
        Model.for_nested_revision_components(klass, level: level + 1)
      end

      def table_name
        klass.table_name
      end

      def new_table_alias
        "new_#{level}"
      end

      def old_table_alias
        "old_#{level}"
      end

      def old_foreign_key
        "#{old_table_alias}.#{foreign_key}"
      end

      def new_id
        "#{new_table_alias}.id"
      end

      def perma_id_column
        @perma_id_column ||=
          if klass.column_names.include?('file_perma_id')
            'file_perma_id'
          else
            'perma_id'
          end
      end

      def insert_list
        quoted_list(insert_columns)
      end

      def select_list(new_foreign_key_value:, perma_id_offset:)
        insert_columns.map { |column|
          case column
          when foreign_key
            new_foreign_key_value
          when 'created_at', 'updated_at'
            'NOW()'
          when 'perma_id'
            perma_id_expr(perma_id_offset)
          else
            "#{old_table_alias}.#{column}"
          end
        }.join(', ')
      end

      def join_as_old_on(id_value:)
        "JOIN #{table_name} AS #{old_table_alias} " \
          "ON #{old_table_alias}.id = #{id_value}"
      end

      def join_as_new_on_matching_perma_id(foreign_key_value:, perma_id_offset:)
        "JOIN #{table_name} AS #{new_table_alias} " \
          "ON #{new_table_alias}.#{foreign_key} = #{foreign_key_value} " \
          "AND #{new_table_alias}.#{perma_id_column} = #{perma_id_expr(perma_id_offset)}"
      end

      private

      def insert_columns
        klass.column_names.reject { |c| c == 'id' }
      end

      def perma_id_expr(offset)
        return "#{old_table_alias}.#{perma_id_column}" if offset.zero?

        "#{old_table_alias}.#{perma_id_column} + #{offset}"
      end

      def quoted_list(columns)
        columns.map { |c| ActiveRecord::Base.connection.quote_column_name(c) }.join(', ')
      end
    end
  end
end
