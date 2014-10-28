module Pageflow
  class TestWidgetType < WidgetType
    attr_reader :name, :roles

    def initialize(options = {})
      @name = options.fetch(:name, 'test_widget')
      @roles = options.fetch(:roles, [])
      @enabled_in_editor = options.fetch(:enabled_in_editor, false)
      @rendered = options.fetch(:rendered, '')
    end

    def enabled_in_editor?
      @enabled_in_editor
    end

    def render(template, entry)
      @rendered.html_safe
    end
  end
end
