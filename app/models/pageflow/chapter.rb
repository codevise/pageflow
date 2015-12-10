module Pageflow
  class Chapter < ActiveRecord::Base
    belongs_to :storyline, touch: true
    has_many :pages, -> { order('position ASC') }

    delegate :entry, to: :storyline

    serialize :configuration, JSON

    def configuration
      super || {}
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
