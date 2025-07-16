module Pageflow
  class StorylineScaffold # rubocop:todo Style/Documentation
    def initialize(storyline, options)
      @storyline = storyline
      @options = options
    end

    delegate :save!, to: :@storyline

    def build
      @chapter_scaffold = ChapterScaffold.build(@storyline, {}, @options)
      self
    end

    def as_json(_ = {})
      @chapter_scaffold.as_json.merge(storyline: @storyline)
    end

    def to_model
      @storyline
    end

    def self.build(revision, attributes, options)
      new(revision.storylines.build(attributes), options).build
    end
  end
end
