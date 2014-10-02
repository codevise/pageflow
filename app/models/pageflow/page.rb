module Pageflow
  class Page < ActiveRecord::Base
    belongs_to :chapter, :touch => true

    attr_accessor :is_first

    validates_inclusion_of :template, :in => ->(_) { Pageflow.config.page_type_names }

    serialize :configuration, JSON

    scope :displayed_in_navigation, -> { where(:display_in_navigation => true) }

    before_save :ensure_perma_id

    def title
      configuration['title'].presence || configuration['additional_title']
    end

    def thumbnail
      model_name, attachment, property, model_class = thumbnail_definition

      begin
        model_name.to_s.camelcase.constantize.find(configuration[property]).send(attachment)
      rescue ActiveRecord::RecordNotFound
        ImageFile.new.processed_attachment
      end
    end

    def thumbnail_definition
      # TODO Refactor to be page type agonostic
      if configuration['thumbnail_image_id'].present?
        ['pageflow/image_file', :processed_attachment, 'thumbnail_image_id', 'image_file']
      elsif template == 'panorama'
        ['pageflow/panorama/package', :thumbnail, 'panorama_package_id', 'package']
      elsif template == 'video' || template == 'background_video'
        if configuration['poster_image_id'].present?
          ['pageflow/image_file', :processed_attachment, 'poster_image_id', 'image_file']
        else
          ['pageflow/video_file', :poster, 'video_file_id', 'video_file']
        end
      else
        if configuration['after_image_id'].present?
          ['pageflow/image_file', :processed_attachment, 'after_image_id','image_file']
        else
          ['pageflow/image_file', :processed_attachment, 'background_image_id', 'image_file']
        end
      end
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
