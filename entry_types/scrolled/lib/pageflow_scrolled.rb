require 'pageflow_scrolled/engine'

# Entry type plugin for entries using native scrolling
module PageflowScrolled
  class << self
    def plugin
      PageflowScrolled::Plugin.new
    end

    def entry_type
      Pageflow::EntryType.new(name: 'scrolled',
                              frontend_app: PageflowScrolled::EntriesController.action(:show),
                              configuration: PageflowScrolled::Configuration,
                              editor_fragment_renderer: editor_fragment_renderer,
                              editor_app: PageflowScrolled::Engine,
                              theme_files: {
                                logo_mobile: LOGO_OPTIONS,
                                logo_desktop: LOGO_OPTIONS
                              })
    end

    private

    def editor_fragment_renderer
      Pageflow::PartialEditorFragmentRenderer.new(PageflowScrolled::Editor::EntriesController)
    end
  end

  LOGO_OPTIONS = {
    content_type: %r{\Aimage/},

    styles: lambda do |file|
      if File.extname(file.file_name) == '.svg'
        {resized: {processors: [:noop]}}
      else
        {resized: '350x100>'}
      end
    end
  }.freeze
end
