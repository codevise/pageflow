module Pageflow
  module React
    class WidgetType < Pageflow::WidgetType
      attr_reader :name, :role, :options

      def initialize(name, role, options = {})
        @name = name
        @role = role
        @options = options
      end

      def roles
        [role]
      end

      def insert_point
        @options[:insert_point] || super
      end

      def render(template, _)
        template.render(File.join('pageflow', 'react', 'widget'), name: name)
      end
    end
  end
end
