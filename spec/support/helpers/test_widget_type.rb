module Pageflow
  class TestWidgetType < WidgetType
    attr_reader :name, :roles

    def initialize(options = {})
      @name = options.fetch(:name, 'test_widget')
      @roles = options.fetch(:roles, [])
      @enabled_in_editor = options.fetch(:enabled_in_editor, false)
      @rendered = options.fetch(:rendered, '')
      @rendered_head_fragment = options.fetch(:rendered_head_fragment, '')
    end

    def enabled_in_editor?
      @enabled_in_editor
    end

    def render(template, entry)
      if @rendered.respond_to?(:call)
        @rendered.call.html_safe
      else
        @rendered.html_safe
      end
    end

    def render_head_fragment(template, entry)
      @rendered_head_fragment.html_safe
    end
  end
end
