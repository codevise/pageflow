module Pageflow
  class Chapter < ActiveRecord::Base
    belongs_to :revision, :touch => true
    has_many :pages, -> { order('position ASC') }

    delegate :entry, :to => :revision

    serialize :configuration, JSON

    def configuration
      super || {}
    end

    def copy_to(revision)
      chapter = dup
      revision.chapters << chapter

      pages.each do |page|
        page.copy_to(chapter)
      end
    end
  end
end
