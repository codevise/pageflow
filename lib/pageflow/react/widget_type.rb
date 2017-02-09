module Pageflow
  module React
    class WidgetType < Pageflow::WidgetType
      attr_reader :name, :role

      def initialize(name, role)
        @name = name
        @role = role
      end

      def roles
        [role]
      end

      def render(template, _)
        template.render(File.join('pageflow', 'react', 'widget'), name: name)
      end
    end
  end
end
