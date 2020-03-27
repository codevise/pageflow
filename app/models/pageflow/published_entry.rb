module Pageflow
  class PublishedEntry
    include ActiveModel::Conversion
    extend ActiveModel::Naming

    attr_reader :entry, :revision
    attr_accessor :share_target

    delegate(:id, :slug,
             :entry_type,
             :account, :theming,
             :enabled_feature_names,
             :to_model, :to_key, :persisted?,
             :authenticate,
             :first_published_at,
             :type_name,
             :to => :entry)

    delegate(:widgets,
             :storylines, :main_storyline_chapters, :chapters, :pages,
             :find_files, :find_file, :find_file_by_perma_id,
             :image_files, :video_files, :audio_files,
             :summary, :credits,
             :share_url, :share_image_id, :share_image_x, :share_image_y,
             :share_providers, :active_share_providers,
             :locale,
             :author, :publisher, :keywords,
             :theme,
             :password_protected?,
             :published_at,
             :configuration,
             :to => :revision)

    def initialize(entry, revision = nil)
      @entry = entry
      @revision = revision || entry.published_revision
      @custom_revision = !!revision
    end

    def title
      revision.title.presence || entry.title
    end

    def manual_start
      revision.configuration['manual_start']
    end

    def emphasize_chapter_beginning
      revision.configuration['emphasize_chapter_beginning']
    end

    def emphasize_new_pages
      revision.configuration['emphasize_new_pages']
    end

    def stylesheet_model
      custom_revision? ? revision : entry
    end

    def stylesheet_cache_key
      revision.cache_key_with_version
    end

    def thumbnail_url(*args)
      thumbnail_file.thumbnail_url(*args)
    end

    def thumbnail_file
      share_image_file ||
        page_thumbnail_file(pages.first) ||
        PositionedFile.null
    end

    def page_thumbnail_file(page)
      return unless page.present?
      ThumbnailFileResolver.new(self, page.page_type.thumbnail_candidates, page.configuration)
                           .find_thumbnail
    end

    def self.find(id, scope = Entry)
      PublishedEntry.new(scope.published.find(id))
    end

    def cache_key
      [
        self.class.model_name.cache_key,
        entry.cache_key,
        revision.cache_key,
        theming.cache_key
      ].compact.join('-')
    end

    def cache_version
      [
        entry.cache_version,
        revision.cache_version,
        theming.cache_version
      ].compact.join('-').presence
    end

    def home_button
      HomeButton.new(revision, theming)
    end

    def overview_button
      OverviewButton.new(revision)
    end

    def resolve_widgets(options = {})
      widgets.resolve(Pageflow.config_for(entry), options)
    end

    private

    def custom_revision?
      @custom_revision
    end

    def share_image_file
      PositionedFile.wrap(find_file_by_perma_id(ImageFile, share_image_id), share_image_x, share_image_y)
    end
  end
end
