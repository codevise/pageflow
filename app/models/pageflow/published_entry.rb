module Pageflow
  class PublishedEntry
    include ActiveModel::Conversion
    extend ActiveModel::Naming

    attr_reader :entry, :revision

    delegate(:id, :account, :theming, :to_model, :to_key, :persisted?, :to => :entry)

    delegate(:widgets, :chapters, :pages, :files,
             :image_files, :video_files, :audio_files,
             :title, :summary, :credits, :manual_start,
             :emphasize_chapter_beginning,
             :emphasize_new_pages,
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
      pages.first.try(:thumbnail_url, *args) || ImageFile.new.processed_attachment.url(*args)
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
  end
end
