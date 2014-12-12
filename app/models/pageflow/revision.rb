module Pageflow
  class Revision < ActiveRecord::Base
    belongs_to :entry, :touch => true
    belongs_to :creator, :class_name => 'User'
    belongs_to :restored_from, :class_name => 'Pageflow::Revision'

    has_many :widgets, :as => :subject
    has_many :chapters, -> { order('position ASC') }
    has_many :pages, -> { reorder('pageflow_chapters.position ASC, pageflow_pages.position ASC') }, :through => :chapters

    has_many :file_usages

    has_many :image_files, -> { extending WithFileUsageExtension },
    :through => :file_usages, :source => :file, :source_type => 'Pageflow::ImageFile'
    has_many :video_files, -> { extending WithFileUsageExtension },
    :through => :file_usages, :source => :file, :source_type => 'Pageflow::VideoFile'
    has_many :audio_files, -> { extending WithFileUsageExtension },
    :through => :file_usages, :source => :file, :source_type => 'Pageflow::AudioFile'

    scope :published, -> do
      where([':now >= published_at AND (published_until IS NULL OR :now < published_until)',
              {:now => Time.now}])
    end

    scope :editable, -> { where('frozen_at IS NULL') }
    scope :frozen, -> { where('frozen_at IS NOT NULL') }

    scope :publications, -> { where('published_at IS NOT NULL') }
    scope :publications_and_user_snapshots, -> { where('published_at IS NOT NULL OR snapshot_type = "user"') }

    validates :entry, :presence => true
    validates :creator, :presence => true, :if => :published?

    validate :published_until_unchanged, :if => :published_until_was_in_past?
    validate :published_until_blank, :if => :published_at_blank?

    def files(model)
      model
        .select("#{model.table_name}.*, pageflow_file_usages.id AS usage_id")
        .joins(:usages)
        .where(pageflow_file_usages: {revision_id: id})
    end

    def creator
      super || NullUser.new
    end

    def locale
      super.presence || I18n.default_locale
    end

    def pages
      super.tap { |p| p.first.is_first = true if p.present? }
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

    def copy(&block)
      revision = dup
      yield(revision) if block_given?

      widgets.each do |widget|
        widget.copy_to(revision)
      end

      chapters.each do |chapter|
        chapter.copy_to(revision)
      end

      file_usages.each do |file_usage|
        file_usage.copy_to(revision)
      end

      Pageflow.config.revision_components.each do |model|
        model.all_for_revision(self).each do |record|
          record.copy_to(revision)
        end
      end

      revision.save!
      revision
    end

    def self.depublish_all
      published.update_all(:published_until => Time.now)
    end

    private

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
  end
end
