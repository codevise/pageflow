module Pageflow
  # A merged view of an entry and its published revision.
  class PublishedEntry < EntryAtRevision
    extend ActiveModel::Naming

    attr_accessor :share_target

    delegate(:authenticate, to: :entry)

    delegate(:password_protected?, to: :revision)

    def initialize(entry, revision = nil, theme: nil)
      super(entry, revision || entry.published_revision, theme: theme)
      @custom_revision = revision
    end

    def title
      revision.title.presence || entry.title
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

    private

    def custom_revision?
      @custom_revision
    end

    def share_image_file
      PositionedFile.wrap(find_file_by_perma_id(ImageFile, share_image_id), share_image_x, share_image_y)
    end
  end
end
