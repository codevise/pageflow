module Pageflow
  module Admin
    class Tabs
      def initialize
        @tabs = {}
      end

      # @param [Symbol] resource_name  A resource name like `:entry` or `:account`
      # @param [Hash] tab_options
      def register(resource_name, tab_options)
        @tabs[resource_name] ||= []
        @tabs[resource_name] << tab_options
      end

      # @api private
      def find_by_resource(name)
        @tabs.fetch(name, [])
      end
    end
  end
end
