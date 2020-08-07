module PageflowPaged
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

      def render(template, entry)
        template.render(File.join('pageflow_paged', 'react', 'widget'),
                        entry: entry,
                        name: name,
                        server_rendering: options[:server_rendering])
      end
    end
  end
end
