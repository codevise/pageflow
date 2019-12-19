module Pageflow
  class TestWidgetType < WidgetType
    attr_reader :name, :roles

    def initialize(options = {})
      @name = options.fetch(:name, 'test_widget')
      @roles = options.fetch(:roles, [])
      @insert_point = options[:insert_point]
      @enabled_in_editor = options.fetch(:enabled_in_editor, true)
      @enabled_in_preview = options.fetch(:enabled_in_preview, true)
      @rendered = options.fetch(:rendered, '')
      @rendered_head_fragment = options.fetch(:rendered_head_fragment, '')
    end

    def enabled_in_editor?
      @enabled_in_editor
    end

    def enabled_in_preview?
      @enabled_in_preview
    end

    def insert_point
      @insert_point || super
    end

    def render(_template, _entry)
      if @rendered.respond_to?(:call)
        @rendered.call.html_safe
      else
        @rendered.html_safe
      end
    end

    def render_head_fragment(_template, _entry)
      @rendered_head_fragment.html_safe
    end
  end
end
