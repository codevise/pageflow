module Pageflow
  class Themes
    include Enumerable

    def initialize
      @themes = HashWithIndifferentAccess.new
    end

    def register(name, options = {})
      @themes[name] = Theme.new(name, options)
    end

    def get(name)
      @themes.fetch(name) { raise(ArgumentError, "Unknown theme '#{name}'.") }
    end

    def names
      map(&:name)
    end

    def each(&block)
      @themes.values.each(&block)
    end
  end
end
