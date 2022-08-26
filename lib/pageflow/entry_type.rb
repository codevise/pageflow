module Pageflow
  # Captures details of how to render entries of a certain type
  #
  # @since 15.1
  class EntryType
    # @api private
    attr_reader :name, :frontend_app, :editor_fragment_renderer, :configuration, :editor_app,
                :theme_files, :web_app_manifest

    # @param name [String] A unique name.
    #
    # @param frontend_app [#call] A rack app that renders the entry
    #   when not in the editor (i.e. preview and published entries).
    #
    # @param editor_fragment_renderer [PartialEditorFragmentRenderer]
    #   Inject content into editor HTML and JSON seed templates.
    #
    # @param configuration [Class] Class including
    #   {Pageflow::Configuration::EntryTypeConfiguration}.
    #
    # @param editor_app [#call] A rack app that extends the REST
    #   interface used by editor Backbone collections. Mounted at
    #   `/editor/entries/:id/<entry_type_name>/`
    #
    # @param theme_files [Hash] A hash of the following form defining
    #   what files can be uploaded when customizing themes of the
    #   entry type and which Paperclip styles shall be processed:
    #   `{logo: {content_type: %r{^image/}, styles: {small:
    #   '300x300>'}}`.
    #
    # @param web_app_manifest [#call] Receives published entry and
    #   returns JSON for webmanifest file.
    def initialize(name:, frontend_app:, editor_fragment_renderer:, configuration:, editor_app: nil,
                   theme_files: {}, web_app_manifest: nil)
      @name = name
      @frontend_app = frontend_app
      @editor_fragment_renderer = editor_fragment_renderer
      @configuration = configuration
      @editor_app = editor_app
      @theme_files = theme_files
      @web_app_manifest = web_app_manifest
    end
  end
end
