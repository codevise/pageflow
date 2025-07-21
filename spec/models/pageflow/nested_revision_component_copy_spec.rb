require 'spec_helper'

# LoggingConnection decorator for capturing SQL statements
class LoggingConnection
  def initialize(connection)
    @connection = connection
    @logged_statements = []
  end

  attr_reader :logged_statements

  def execute(sql)
    @logged_statements << sql if sql.start_with?('INSERT')
    @connection.execute(sql)
  end

  def select_one(sql)
    @connection.select_one(sql)
  end

  def quote_column_name(name)
    @connection.quote_column_name(name)
  end

  def method_missing(method, *, &)
    @connection.send(method, *, &)
  end

  def respond_to_missing?(method, include_private = false)
    @connection.respond_to?(method, include_private) || super
  end
end

module Pageflow
  describe NestedRevisionComponentCopy do
    describe '#copy_all' do
      it 'copies nested revision components' do
        revision = create(:revision)
        entry = revision.entry

        original = TestCompositeRevisionComponent.create!(revision: revision)
        nested_a = original.items.create!(text: 'nested-a')
        nested_b = original.items.create!(text: 'nested-b')
        deep = nested_a.items.create!(text: 'deep')
        duplicate = original.dup
        duplicate.save!

        entry.reload
        old_counter = entry.perma_id_counter
        expect(old_counter).to eq(deep.perma_id)

        NestedRevisionComponentCopy
          .new(from: original, to: duplicate)
          .perform_for_nested_revision_components

        duplicate.reload
        expect(duplicate.items.map(&:perma_id)).to eq([nested_a.perma_id, nested_b.perma_id])
        expect(duplicate.items.first.items.first.perma_id).to eq(deep.perma_id)
        expect(entry.reload.perma_id_counter).to eq(old_counter)
      end

      it 'resets perma ids when option is true' do
        revision = create(:revision)
        entry = revision.entry

        original = TestCompositeRevisionComponent.create!(revision: revision)
        nested_a = original.items.create!(text: 'nested-a')
        original.items.create!(text: 'nested-b')
        nested_a.items.create!(text: 'deep')
        duplicate = original.dup
        duplicate.save!

        entry.reload
        old_counter = entry.perma_id_counter
        expect(old_counter).to eq(nested_a.items.first.perma_id)

        NestedRevisionComponentCopy
          .new(from: original, to: duplicate, reset_perma_ids: true)
          .perform_for_nested_revision_components

        duplicate.reload
        expect(duplicate.items.map(&:perma_id)).to eq([old_counter + 1, old_counter + 2])
        expect(duplicate.items.first.items.first.perma_id).to eq(old_counter + 3)
        expect(entry.reload.perma_id_counter).to eq(old_counter + 3)
      end

      it 'copies nested components when passing revisions' do
        original_revision = create(:revision)
        duplicate_revision = create(:revision, entry: original_revision.entry)

        original = TestCompositeRevisionComponent.create!(revision: original_revision)
        nested = original.items.create!(text: 'nested')
        deep = nested.items.create!(text: 'deep')

        NestedRevisionComponentCopy
          .new(from: original_revision, to: duplicate_revision)
          .perform_for(revision_components: [TestCompositeRevisionComponent])

        copy = TestCompositeRevisionComponent
               .all_for_revision(duplicate_revision)
               .first
        expect(copy.perma_id).to eq(original.perma_id)
        expect(copy.items.first.perma_id).to eq(nested.perma_id)
        expect(copy.items.first.items.first.perma_id).to eq(deep.perma_id)
      end

      it 'generates expected SQL statements' do
        revision = create(:revision)
        original = TestCompositeRevisionComponent.create!(revision: revision)
        nested = original.items.create!(text: 'nested')
        nested.items.create!(text: 'deep')

        duplicate = original.dup
        duplicate.save!

        logging_connection = LoggingConnection.new(ActiveRecord::Base.connection)

        NestedRevisionComponentCopy
          .new(
            from: original, to: duplicate,
            connection: logging_connection
          )
          .perform_for_nested_revision_components

        expect(logging_connection.logged_statements.size).to eq(2)

        expected_first_sql = <<~SQL.squish
          INSERT INTO test_nested_revision_components (`parent_id`, `perma_id`, `text`, `created_at`, `updated_at`)
          SELECT #{duplicate.id}, old_1.perma_id, old_1.text, NOW(), NOW()
          FROM test_nested_revision_components AS old_1
          WHERE old_1.parent_id = #{original.id}
        SQL

        expect(logging_connection.logged_statements[0].squish).to eq(expected_first_sql)

        expected_second_sql = <<~SQL.squish
          INSERT INTO test_deeply_nested_revision_components (`parent_id`, `perma_id`, `text`, `created_at`, `updated_at`)
          SELECT new_1.id, old_2.perma_id, old_2.text, NOW(), NOW()
          FROM test_deeply_nested_revision_components AS old_2
          JOIN test_nested_revision_components AS old_1 ON old_1.id = old_2.parent_id
          JOIN test_nested_revision_components AS new_1 ON new_1.parent_id = #{duplicate.id} AND new_1.perma_id = old_1.perma_id
          WHERE old_1.parent_id = #{original.id}
        SQL
        expect(logging_connection.logged_statements[1].squish).to eq(expected_second_sql)
      end

      it 'generates expected SQL statements with offset' do
        revision = create(:revision)
        entry = revision.entry

        # Set up explicit perma_ids so we can predict the offset calculation
        # Start with perma_id_counter = 5, create items with perma_ids 6, 7, 8
        entry.update!(perma_id_counter: 5)

        original = TestCompositeRevisionComponent.create!(revision: revision)
        nested_a = original.items.build(text: 'nested-a')
        nested_a.perma_id = 6
        nested_a.save!

        nested_b = original.items.build(text: 'nested-b')
        nested_b.perma_id = 7
        nested_b.save!

        deep = nested_a.items.build(text: 'deep')
        deep.perma_id = 8
        deep.save!

        # Update counter to reflect the created items
        entry.update!(perma_id_counter: 8)

        duplicate = original.dup
        duplicate.save!

        logging_connection = LoggingConnection.new(ActiveRecord::Base.connection)

        NestedRevisionComponentCopy
          .new(
            from: original, to: duplicate,
            reset_perma_ids: true,
            connection: logging_connection
          )
          .perform_for_nested_revision_components

        expect(logging_connection.logged_statements.size).to eq(2)

        # With perma_ids [6,7,8] and counter=8, offset should be: 8 - 6 + 1 = 3
        # New perma_ids will be: 6+3=9, 7+3=10, 8+3=11
        expected_first_sql = <<~SQL.squish
          INSERT INTO test_nested_revision_components (`parent_id`, `perma_id`, `text`, `created_at`, `updated_at`)
          SELECT #{duplicate.id}, old_1.perma_id + 3, old_1.text, NOW(), NOW()
          FROM test_nested_revision_components AS old_1
          WHERE old_1.parent_id = #{original.id}
        SQL
        expect(logging_connection.logged_statements[0].squish).to eq(expected_first_sql)

        expected_second_sql = <<~SQL.squish
          INSERT INTO test_deeply_nested_revision_components (`parent_id`, `perma_id`, `text`, `created_at`, `updated_at`)
          SELECT new_1.id, old_2.perma_id + 3, old_2.text, NOW(), NOW()
          FROM test_deeply_nested_revision_components AS old_2
          JOIN test_nested_revision_components AS old_1 ON old_1.id = old_2.parent_id
          JOIN test_nested_revision_components AS new_1 ON new_1.parent_id = #{duplicate.id} AND new_1.perma_id = old_1.perma_id + 3
          WHERE old_1.parent_id = #{original.id}
        SQL
        expect(logging_connection.logged_statements[1].squish).to eq(expected_second_sql)
      end

      it 'generates expected SQL statements with offset starting from revision' do
        original_revision = create(:revision)
        entry = original_revision.entry

        # Set up explicit perma_ids so we can predict the offset calculation
        # Start with perma_id_counter = 5, create items with perma_ids 6, 7, 8
        entry.update!(perma_id_counter: 5)

        original = TestCompositeRevisionComponent.create!(revision: original_revision, perma_id: 4)
        nested_a = original.items.build(text: 'nested-a')
        nested_a.perma_id = 6
        nested_a.save!

        nested_b = original.items.build(text: 'nested-b')
        nested_b.perma_id = 7
        nested_b.save!

        deep = nested_a.items.build(text: 'deep')
        deep.perma_id = 8
        deep.save!

        # Update counter to reflect the created items
        entry.update!(perma_id_counter: 8)

        duplicate_revision = original_revision.dup
        duplicate_revision.save!

        logging_connection = LoggingConnection.new(ActiveRecord::Base.connection)

        NestedRevisionComponentCopy
          .new(
            from: original_revision, to: duplicate_revision,
            reset_perma_ids: true,
            connection: logging_connection
          )
          .perform_for(revision_components: [TestCompositeRevisionComponent])

        expect(logging_connection.logged_statements.size).to eq(3)

        expected_first_sql = <<~SQL.squish
          INSERT INTO test_revision_components (`revision_id`, `perma_id`, `text`, `created_at`, `updated_at`)
          SELECT #{duplicate_revision.id}, old_1.perma_id + 5, old_1.text, NOW(), NOW()
          FROM test_revision_components AS old_1
          WHERE old_1.revision_id = #{original_revision.id}
        SQL
        expect(logging_connection.logged_statements[0].squish).to eq(expected_first_sql)

        expected_second_sql = <<~SQL.squish
          INSERT INTO test_nested_revision_components (`parent_id`, `perma_id`, `text`, `created_at`, `updated_at`)
          SELECT new_1.id, old_2.perma_id + 4, old_2.text, NOW(), NOW()
          FROM test_nested_revision_components AS old_2
          JOIN test_revision_components AS old_1 ON old_1.id = old_2.parent_id
          JOIN test_revision_components AS new_1 ON new_1.revision_id = #{duplicate_revision.id} AND new_1.perma_id = old_1.perma_id + 5
          WHERE old_1.revision_id = #{original_revision.id}
        SQL
        expect(logging_connection.logged_statements[1].squish).to eq(expected_second_sql)

        expected_third_sql = <<~SQL.squish
          INSERT INTO test_deeply_nested_revision_components (`parent_id`, `perma_id`, `text`, `created_at`, `updated_at`)
          SELECT new_2.id, old_3.perma_id + 4, old_3.text, NOW(), NOW()
          FROM test_deeply_nested_revision_components AS old_3
          JOIN test_nested_revision_components AS old_2 ON old_2.id = old_3.parent_id
          JOIN test_revision_components AS old_1 ON old_1.id = old_2.parent_id
          JOIN test_revision_components AS new_1 ON new_1.revision_id = #{duplicate_revision.id} AND new_1.perma_id = old_1.perma_id + 5
          JOIN test_nested_revision_components AS new_2 ON new_2.parent_id = new_1.id AND new_2.perma_id = old_2.perma_id + 4
          WHERE old_1.revision_id = #{original_revision.id}
        SQL
        expect(logging_connection.logged_statements[2].squish).to eq(expected_third_sql)
      end
    end
  end
end
