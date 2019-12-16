require 'pageflow_paged/engine'

# Entry type plugin for classic Pageflow entries
module PageflowPaged
  class << self
    def plugin
      PageflowPaged::Plugin.new
    end

    def entry_type
      Pageflow::EntryType.new(name: 'paged',
                              frontend_app: Pageflow::PagedEntriesController.action(:show),
                              editor_fragment_renderer: editor_fragment_renderer,
                              configuration: Plugin::PagedConfiguration)
    end

    private

    def editor_fragment_renderer
      Pageflow::PartialEditorFragmentRenderer.new(PageflowPaged::Editor::EntriesController)
    end
  end
end
