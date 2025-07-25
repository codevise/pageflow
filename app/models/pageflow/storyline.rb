module Pageflow
  class Storyline < ApplicationRecord # rubocop:todo Style/Documentation
    include SerializedConfiguration
    include RevisionComponent

    has_many(:chapters,
             -> { order('pageflow_chapters.position ASC') },
             dependent: :destroy,
             inverse_of: :storyline)

    has_many :pages, through: :chapters

    nested_revision_components :chapters
    delegate :entry, to: :revision

    def self.create_defaults(draft)
      create!(revision: draft, configuration: {main: true})
    end
  end
end
