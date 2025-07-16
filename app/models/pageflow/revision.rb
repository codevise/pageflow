module Pageflow
  class Revision < ApplicationRecord
    include SerializedConfiguration

    PAGE_ORDER = [
      'pageflow_storylines.position ASC',
      'pageflow_chapters.position ASC',
      'pageflow_pages.position ASC'
    ].join(',')

    CHAPTER_ORDER = [
      'pageflow_storylines.position ASC',
      'pageflow_chapters.position ASC'
    ].join(',')

    include ThemeReferencer

    serialize :share_providers, coder: JSON

    belongs_to :entry, touch: :edited_at
    belongs_to :creator, class_name: 'User', optional: true
    belongs_to :restored_from, class_name: 'Pageflow::Revision', optional: true

    has_many :widgets, as: :subject, dependent: :destroy

    has_many :storylines, -> { order('pageflow_storylines.position ASC') }, dependent: :destroy
    has_many :chapters, -> { order(CHAPTER_ORDER) }, through: :storylines
    has_many :pages, -> { reorder(PAGE_ORDER) }, through: :storylines

    has_many :file_usages, dependent: :destroy

    has_many :image_files, -> { extending WithFileUsageExtension },
             through: :file_usages, source: :file, source_type: 'Pageflow::ImageFile'
    has_many :video_files, -> { extending WithFileUsageExtension },
             through: :file_usages, source: :file, source_type: 'Pageflow::VideoFile'
    has_many :audio_files, -> { extending WithFileUsageExtension },
             through: :file_usages, source: :file, source_type: 'Pageflow::AudioFile'

    scope(:published,
          lambda do
            # The following query would be much easier expressed as
            #
            #   where.not(published_at: nil)
            #     .where(['(published_until IS NULL OR published_until > :now)',
            #            {now: Time.now}])
            #
            # But referencing `published_until` without qualifying it
            # with a table name or alias makes it ambiguous when the
            # revisions table is joined multiple times in a query.
            #
            # The hash syntax makes sure the correct dynamically
            # generated table alias is used.

            published_indefinitely =
              where.not(published_at: nil).where(published_until: nil)

            published_until_gt_now = {published_until: 1.second.from_now..DateTime::Infinity.new}

            published_and_not_yet_depublished =
              where.not(published_at: nil).where(published_until_gt_now)

            published_indefinitely.or(published_and_not_yet_depublished)
          end)

    scope(:with_password_protection, -> { where('password_protected IS TRUE') })
    scope(:without_password_protection, -> { where('password_protected IS NOT TRUE') })

    scope(:without_noindex, -> { where('noindex IS NOT TRUE') })

    scope :editable, -> { where('frozen_at IS NULL') }
    scope :frozen, -> { where('frozen_at IS NOT NULL') }

    scope :publications, -> { where('published_at IS NOT NULL') }
    scope :publications_and_user_snapshots, lambda {
      where(
        'published_at IS NOT NULL OR snapshot_type = "user"'
      )
    }
    scope :user_snapshots, -> { where(snapshot_type: 'user') }
    scope :auto_snapshots, -> { where(snapshot_type: 'auto') }

    validates :entry, presence: true
    validates :creator, presence: true, if: :published?

    validate :published_until_unchanged, if: :published_until_was_in_past?
    validate :published_until_blank, if: :published_at_blank?

    def main_storyline_chapters
      main_storyline = storylines.first
      main_storyline ? main_storyline.chapters : Chapter.none
    end

    def find_files(model)
      files(model).map do |file|
        UsedFile.new(file)
      end
    end

    def find_file(model, id)
      file = files(model).find(id)
      UsedFile.new(file)
    end

    def find_file_by_perma_id(model, perma_id)
      file = files(model).find_by(pageflow_file_usages: {file_perma_id: perma_id})
      return unless file

      UsedFile.new(file)
    end

    def share_providers
      self[:share_providers] || entry.entry_template.default_share_providers
    end

    def author
      read_attribute(:author) || Pageflow.config.default_author_meta_tag
    end

    def publisher
      read_attribute(:publisher) || Pageflow.config.default_publisher_meta_tag
    end

    def keywords
      read_attribute(:keywords) || Pageflow.config.default_keywords_meta_tag
    end

    def active_share_providers
      share_providers.select { |_k, v| v }.keys
    end

    def creator
      super || NullUser.new
    end

    def locale
      super.presence || I18n.default_locale.to_s
    end

    def pages
      super.tap { |p| p.first.is_first = true if p.present? }
    end

    def chapters
      super.tap { |c| c.first.is_first = true if c.present? }
    end

    def published?
      (published_at.present? && Time.now >= published_at) &&
        (published_until.blank? || Time.now < published_until)
    end

    def frozen?
      frozen_at.present?
    end

    def created_with
      if published_at
        :publish
      elsif snapshot_type == 'auto'
        :auto
      elsif snapshot_type == 'user'
        :user
      else
        :restore
      end
    end

    # Public interface for copying a revision
    #
    # @since 15.1
    def copy
      revision = dup

      yield(revision) if block_given?

      widgets.each do |widget|
        widget.copy_to(revision)
      end

      file_usages.each do |file_usage|
        file_usage.copy_to(revision)
      end

      find_revision_components.each do |revision_component|
        revision_component.copy_to(revision)
      end

      revision.save!
      revision
    end

    def find_revision_components
      Pageflow.config.revision_components.flat_map do |model|
        model.all_for_revision(self).to_a
      end
    end

    def self.depublish_all
      published.update_all(published_until: Time.now)
    end

    def configuration
      {
        'emphasize_chapter_beginning' => emphasize_chapter_beginning,
        'emphasize_new_pages' => emphasize_new_pages,
        'home_url' => home_url,
        'home_button_enabled' => home_button_enabled,
        'manual_start' => manual_start,
        'overview_button_enabled' => overview_button_enabled
      }.delete_if { |_k, v| v.nil? }
        .merge(read_attribute(:configuration) || {})
    end

    def self.ransackable_attributes(_auth_object = nil)
      %w[published_at]
    end

    private

    def files(model)
      model
        .includes(:usages)
        .references(:pageflow_file_usages)
        .where(pageflow_file_usages: {revision_id: id})
    end

    def published_until_unchanged
      errors.add(:published_until, :readonly) if published_until_changed?
    end

    def published_until_blank
      errors.add(:published_until, :readonly) if published_until.present?
    end

    def published_until_was_in_past?
      published_until_was.present? && published_until_was < Time.now
    end

    def published_at_blank?
      published_at.blank?
    end

    def available_themes
      @available_themes ||= Pageflow.config_for(entry).themes
    end
  end
end
