module Pageflow
  module Admin
    class ExtensibleAttributesTable < ActiveAdmin::Views::AttributesTable
      # @api private
      module BuilderMethods
        def extensible_attributes_table_for(model, additional_rows, &block)
          attributes_table_for(model) do
            row_inserter = RowInserter.new(self, additional_rows)
            RowDelegator.new(self, row_inserter).instance_eval(&block)
            row_inserter.at_end_of_table
          end
        end
      end

      # @api private
      class RowInserter
        def initialize(context, additional_rows)
          @context = context
          @additional_rows = additional_rows
          @rendered_rows = []
        end

        def row(name, options = {}, &block)
          render_additional_rows(rows_at(:before, name))
          context.row(name, options, &block)
          render_additional_rows(rows_at(:after, name))
        end

        def at_end_of_table
          render_additional_rows(not_yet_rendered_rows)
        end

        private

        attr_reader :context, :additional_rows, :rendered_rows

        def render_additional_rows(additional_rows)
          additional_rows.each do |additional_row|
            block =
              additional_row[:block] &&
              ->(*args) { context.instance_exec(*args, &additional_row[:block]) }

            context.row(additional_row[:name],
                        additional_row[:options],
                        &block)
          end

          rendered_rows.concat(additional_rows)
        end

        def rows_at(position, name)
          additional_rows.select { |additional_row| additional_row[position] == name }
        end

        def not_yet_rendered_rows
          additional_rows - rendered_rows
        end
      end

      # @api private
      class RowDelegator
        def initialize(context, row_handler)
          @context = context
          @row_handler = row_handler
        end

        def row(name, options = {}, &block)
          @row_handler.row(name, options, &block)
        end

        private

        def respond_to_missing?(name, _include_private = false)
          @context.respond_to?(name)
        end

        # Normally we would delegate to super if context does not
        # respond_to? method. But Arbre appears to report not to
        # repond to helpers like authorized? even if it does.
        #
        # This is also the reason we can not use SimpleDelegator here
        # and also delegate_missing in Rails 5 would not work.
        def method_missing(method, *args, **kwargs, &block)
          @context.public_send(method, *args, **kwargs, &block)
        end
      end
    end
  end
end
