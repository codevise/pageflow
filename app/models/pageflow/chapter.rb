module Pageflow
  class Chapter < ApplicationRecord
    include SerializedConfiguration

    belongs_to :storyline, touch: true
    has_many :pages, -> { order('position ASC') }, dependent: :destroy, inverse_of: :chapter

    attr_accessor :is_first

    delegate :entry, to: :storyline

    def pages
      super.tap { |p| p.first.is_first = true if is_first && p.present? }
    end

    def copy_to(storyline)
      chapter = dup
      storyline.chapters << chapter

      pages.each do |page|
        page.copy_to(chapter)
      end
    end
  end
end
