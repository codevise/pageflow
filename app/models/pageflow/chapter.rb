module Pageflow
  class Chapter < ApplicationRecord
    include SerializedConfiguration
    include NestedRevisionComponent

    belongs_to :storyline, touch: true
    has_many :pages, -> { order('position ASC') }, dependent: :destroy, inverse_of: :chapter

    nested_revision_components :pages

    attr_accessor :is_first

    delegate :entry, to: :storyline

    def pages
      super.tap { |p| p.first.is_first = true if is_first && p.present? }
    end
  end
end
