module Pageflow
  class Page < ActiveRecord::Base
    belongs_to :chapter, :touch => true

    attr_accessor :is_first

    validates_inclusion_of :template, :in => ->(_) { Pageflow.config.page_types.names }

    serialize :configuration, JSON

    scope :displayed_in_navigation, -> { where(:display_in_navigation => true) }

    before_save :ensure_perma_id

    def title
      configuration['title'].presence || configuration['additional_title']
    end

    def thumbnail_url(*args)
      thumbnail_file.thumbnail_url(*args)
    end

    def thumbnail_file
      ThumbnailFileResolver.new(page_type.thumbnail_candidates, configuration).find
    end

    def page_type
      Pageflow.config.page_types.find_by_name!(template)
    end

    def configuration
      super || {}
    end

    def configuration=(value)
      self.display_in_navigation = value['display_in_navigation']
      super
    end

    def copy_to(chapter)
      chapter.pages << dup
    end

    def ensure_perma_id
      self.perma_id ||= (Page.maximum(:perma_id) || 0) + 1
    end
  end
end
