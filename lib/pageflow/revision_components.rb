module Pageflow
  class RevisionComponents
    include Enumerable

    def initialize
      @revision_components = []
    end

    def register(revision_component)
      @revision_components << revision_component unless
        @revision_components.include?(revision_component)
    end

    def each(&block)
      @revision_components.each(&block)
    end
  end
end
