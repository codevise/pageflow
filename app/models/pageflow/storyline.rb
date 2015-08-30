module Pageflow
  class Storyline < ActiveRecord::Base
    include RevisionComponent

    belongs_to :revision, touch: true

    has_many :chapters
    has_many :pages, through: :chapters

    delegate :entry, to: :revision

    serialize :configuration, JSON

    def copy_to(revision)
      storyline = dup
      revision.storylines << storyline

      chapters.each do |chapter|
        chapter.copy_to(storyline)
      end
    end
  end
end
