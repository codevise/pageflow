module Pageflow
  class Storyline < ApplicationRecord
    include SerializedConfiguration
    include RevisionComponent

    belongs_to :revision, touch: true

    has_many(:chapters,
             -> { order('pageflow_chapters.position ASC') },
             dependent: :destroy,
             inverse_of: :storyline)

    has_many :pages, through: :chapters

    delegate :entry, to: :revision

    def copy_to(revision)
      storyline = dup
      revision.storylines << storyline

      chapters.each do |chapter|
        chapter.copy_to(storyline)
      end
    end
  end
end
