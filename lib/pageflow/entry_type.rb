module Pageflow
  # Captures details of how to render entries of a certain type
  #
  # @since edge
  class EntryType
    # @api private
    attr_reader :name

    # @param name [String] A unique name.
    def initialize(name:)
      @name = name
    end
  end
end
