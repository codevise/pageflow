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
                              editor_fragment_renderer:,
                              editor_app: PageflowScrolled::Engine,
                              web_app_manifest: PageflowScrolled::WebAppManifest,
                              theme_files: {
                                logo_mobile: LOGO_OPTIONS,
                                logo_desktop: LOGO_OPTIONS,
                                **FAVICONS
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

  FAVICONS = {
    favicon: {
      content_type: %r{\Aimage/svg\+xml\z},
      styles: {original: {}}
    },
    favicon_png: {
      content_type: %r{\Aimage/},
      styles: {
        w16: {
          geometry: '16x16#',
          format: 'png'
        },
        w32: {
          geometry: '32x32#',
          format: 'png'
        },
        w180: {
          geometry: '180x180#',
          format: 'png'
        },
        w192: {
          geometry: '192x192#',
          format: 'png'
        },
        w512: {
          geometry: '512x512#',
          format: 'png'
        }
      }
    },
    favicon_ico: {
      content_type: %r{\Aimage/vnd.microsoft.icon\z},
      styles: {original: {}}
    }
  }.freeze
end
