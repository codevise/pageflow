module Pageflow
  # A registry of additional rows to display in attribute tables on
  # admin pages.
  #
  # @since 12.2
  module Admin
    class AttributesTableRows
      # @api private
      def initialize
        @rows = {}
      end

      # Insert an additional row into an attribute table.
      #
      # @param resource_name [Symbol] Either :entry, :account or :site.
      #
      # @param name [Symbol] Name of the attribute to display.
      #
      # @param options [Hash] Supports same options as
      #   ActiveAdmin::Views::AttributesTable#row, in addition to:
      #
      # @option options [Symbol] :before Insert row before row with
      #   given name. Append to table if not found.
      #
      # @option options [Symbol] :after Insert row after row with
      #   given name. Append to table if not found.
      #
      # @yieldparam resource [ActiveRecord::Base] A block which is
      #   evaluated in the context of the Arbre template to render the
      #   contents of the cell.
      def register(resource_name, name, options = {}, &block)
        @rows[resource_name] ||= []
        @rows[resource_name] << {
          name:,
          block:,
          options: options.except(:before, :after),
          **options.slice(:before, :after)
        }
      end

      # @api private
      def for(resource_name)
        @rows.fetch(resource_name, [])
      end
    end
  end
end
