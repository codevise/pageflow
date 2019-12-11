require 'pageflow_scrolled/engine'

# Entry type plugin for entries using native scrolling
module PageflowScrolled
  class << self
    def plugin
      PageflowScrolled::Plugin.new
    end

    def entry_type
      Pageflow::EntryType.new(name: 'scrolled',
                              frontend_app: lambda do |_env|
                                [200, {'Content-Type' => 'text/html'}, ['Scrolled']]
                              end,
                              editor_fragment_renderer: editor_fragment_renderer)
    end

    private

    def editor_fragment_renderer
      Pageflow::PartialEditorFragmentRenderer.new(PageflowScrolled::Editor::EntriesController)
    end
  end
end
