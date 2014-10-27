module Pageflow
  module Admin
    class Tabs
      def initialize
        @tabs = {}
      end

      def register(resource_name, view_component)
        @tabs[resource_name] ||= []
        @tabs[resource_name] << view_component
      end

      def find_by_resource(name)
        @tabs.fetch(name, [])
      end
    end
  end
end
