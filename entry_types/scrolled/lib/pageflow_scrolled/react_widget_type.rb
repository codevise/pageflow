module PageflowScrolled
  # Widget type that shall be rendered by a React component. Add a
  # Webpacker pack named `pageflow-scrolled/widgets/<name>.js` which
  # calls `frontend.widgetTypes.register`to pass the React
  # component. Add a pack named
  # `pageflow-scrolled/widgets/<name>Theme.css` to define cutom
  # styles.
  #
  # @since 15.7
  class ReactWidgetType < Pageflow::WidgetType
    def initialize(role:, name:, enabled_in_editor: true)
      @role = role
      @name = name
      @enabled_in_editor = enabled_in_editor
    end

    attr_reader :name

    def insert_point
      :react
    end

    def roles
      [@role]
    end

    def enabled_in_editor?
      @enabled_in_editor
    end

    def render(*)
      ''
    end

    # @api private
    def pack
      "pageflow-scrolled/widgets/#{name}"
    end

    # @api private
    def self.all_for(entry)
      Pageflow.config_for(entry).widget_types.select do |widget_type|
        widget_type.insert_point == :react
      end
    end
  end
end
