module Pageflow
  # A merged view of an entry and its published revision.
  class PublishedEntry < EntryAtRevision
    extend ActiveModel::Naming

    attr_accessor :share_target

    delegate(:authenticate,
             :default_translation?,
             to: :entry)

    delegate(:password_protected?, to: :revision)

    def initialize(entry, revision = nil, theme: nil)
      super(entry, revision || entry.published_revision, theme:)
      @custom_revision = revision
    end

    def title
      revision.title.presence || entry.title
    end

    def translations(scope = -> { self }, include_noindex: false)
      return [] unless entry.translation_group

      if published_revision?
        self.class.wrap_all(
          published_translation_entries(include_noindex:).instance_exec(&scope)
        )
      else
        self.class.wrap_all_drafts(
          entry.translation_group.entries.instance_exec(&scope)
        )
      end
    end

    def cutoff_mode_enabled_for?(request)
      Pageflow.config.cutoff_modes.enabled_for?(self, request)
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

    def self.find_by_permalink(slug:, scope:, directory: nil)
      wrap(
        scope.published.includes(permalink: :directory).where(
          pageflow_permalink_directories: {path: directory || ''},
          pageflow_permalinks: {slug:}
        ).first
      )
    end

    def self.find_by_permalink_redirect(site:, slug:, directory: nil)
      wrap(
        PermalinkRedirect.joins(:entry, :directory).merge(Entry.published).where(
          slug:,
          pageflow_permalink_directories: {
            path: directory || '',
            site:
          }
        ).first&.entry
      )
    end

    def self.wrap_all(entries)
      entries = entries.includes(:published_revision) unless entries.loaded?
      entries.map { |entry| new(entry) }
    end

    def cache_key
      [
        self.class.model_name.cache_key,
        entry.cache_key,
        revision.cache_key,
        site.cache_key
      ].compact.join('-')
    end

    def cache_version
      [
        entry.cache_version,
        revision.cache_version,
        site.cache_version
      ].compact.join('-').presence
    end

    def published_revision?
      !custom_revision?
    end

    private

    def published_translation_entries(include_noindex:)
      translation_group = entry.translation_group

      if password_protected? && include_noindex
        translation_group.published_entries
      elsif password_protected?
        translation_group.entries_published_without_noindex
      elsif include_noindex
        translation_group.entries_published_without_password_protection
      else
        translation_group.publicly_visible_entries
      end
    end

    def custom_revision?
      @custom_revision
    end

    def share_image_file
      PositionedFile.wrap(find_file_by_perma_id(ImageFile, share_image_id), share_image_x,
                          share_image_y)
    end

    class << self
      private

      def wrap(entry)
        entry && new(entry)
      end
    end
  end
end
