module Pageflow
  # Captures details of how to render entries of a certain type
  #
  # @since 15.1
  class EntryType
    # @api private
    attr_reader :name, :frontend_app

    # @param name [String] A unique name.
    #
    # @param frontend_app [#call] A rack app that renders the entry
    #   when not in the editor (i.e. preview and published entries).
    def initialize(name:, frontend_app:)
      @name = name
      @frontend_app = frontend_app
    end
  end
end
