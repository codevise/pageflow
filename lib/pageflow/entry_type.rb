module Pageflow
  # Captures details of how to render entries of a certain type
  #
  # @since 15.1
  class EntryType
    # @api private
    attr_reader :name, :frontend_app, :editor_fragment_renderer

    # @param name [String] A unique name.
    #
    # @param frontend_app [#call] A rack app that renders the entry
    #   when not in the editor (i.e. preview and published entries).
    #
    # @param editor_fragment_renderer
    def initialize(name:, frontend_app:, editor_fragment_renderer:)
      @name = name
      @frontend_app = frontend_app
      @editor_fragment_renderer = editor_fragment_renderer
    end
  end
end
