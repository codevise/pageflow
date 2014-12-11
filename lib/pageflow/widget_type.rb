module Pageflow
  class WidgetType
    # Name to display in editor.
    def translation_key
      "pageflow.#{name}.widget_type_name"
    end

    # Override to return a string in snake_case.
    def name
      raise(NotImplementedError, 'WidgetType subclass needs to define name method.')
    end

    # Override to return array of role names.
    def roles
      raise(NotImplementedError, 'WidgetType subclass needs to define roles method.')
    end

    # Override to return false to hide widget in editor.
    def enabled_in_editor?
      true
    end

    # Override to return html as string.
    def render(template, entry)
      template.render(File.join('pageflow', name, 'widget'), entry: entry)
    end

    # Override to return html that should be placed in the head
    # element of the page. Not supported inside the editor.
    def render_head_fragment(template, entry)
      ''
    end

    class Null < WidgetType
      def initialize(role)
        @role = role
      end

      def name
        'null'
      end

      def roles
        [@role]
      end

      def render(*)
        ''
      end
    end
  end
end
