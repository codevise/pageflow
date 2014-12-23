module Pageflow
  class PublishedEntry
    include ActiveModel::Conversion
    extend ActiveModel::Naming

    attr_reader :entry, :revision
    attr_accessor :share_target

    delegate(:id, :account, :theming, :to_model, :to_key, :persisted?, :to => :entry)

    delegate(:widgets, :chapters, :pages, :files,
             :image_files, :video_files, :audio_files,
             :title, :summary, :credits, :manual_start,
             :emphasize_chapter_beginning,
             :emphasize_new_pages,
             :share_image_id, :share_image_x, :share_image_y,
             :locale,
             :to => :revision)

    def initialize(entry, revision = nil)
      @entry = entry
      @revision = revision || entry.published_revision
      @custom_revision = !!revision
    end

    def stylesheet_model
      custom_revision? ? revision : entry
    end

    def stylesheet_cache_key
      revision.cache_key
    end

    def thumbnail_url(*args)
      thumbnail_file.thumbnail_url(*args)
    end

    def thumbnail_file
      share_image_file ||
        pages.first.try(:thumbnail_file) ||
        PositionedFile.null
    end

    def self.find(id, scope = Entry)
      PublishedEntry.new(scope.published.find(id))
    end

    def cache_key
      "#{self.class.model_name.cache_key}/#{entry.cache_key}-#{revision.cache_key}"
    end

    def home_button
      HomeButton.new(revision, theming)
    end

    private

    def custom_revision?
      @custom_revision
    end

    def share_image_file
      PositionedFile.wrap(ImageFile.find_by_id(share_image_id), share_image_x, share_image_y)
    end
  end
end
