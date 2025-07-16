module Pageflow
  class HelpEntry # rubocop:todo Style/Documentation
    attr_reader :name, :children

    def initialize(name, options)
      @name = name
      @options = options
      @children = []
    end

    def translation_key
      name
    end

    def priority
      @options.fetch(:priority, 10)
    end
  end
end
