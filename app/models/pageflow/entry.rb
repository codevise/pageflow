module Pageflow
  class Entry < ActiveRecord::Base
    extend FriendlyId
    friendly_id :slug_candidates, :use => [:finders, :slugged]

    belongs_to :account
    belongs_to :folder
    belongs_to :theming

    has_many :revisions, -> { order('frozen_at DESC') }

    has_many :chapters, -> { order('pageflow_chapters.position ASC') }, :through => :revisions
    has_many :pages, -> { order('pageflow_chapters.position ASC, pageflow_pages.position ASC') }, :through => :chapters

    has_many :memberships, :dependent => :destroy
    has_many :users, :through => :memberships, :class_name => '::User'

    has_many :image_files
    has_many :video_files
    has_many :audio_files

    has_one :theme, :through => :theming
    has_one :draft, -> { editable }, :class_name => 'Revision'
    has_one :published_revision, -> { published }, :class_name => 'Revision'

    has_one :edit_lock, :dependent => :destroy

    validates :account, :theming, :presence => true
    validate :folder_belongs_to_same_account

    scope :published, -> { joins(:published_revision) }
    scope :editing, -> { joins(:edit_lock).merge(Pageflow::EditLock.active) }

    after_create :create_draft!

    def edit_lock
      super || EditLock::Null.new(self)
    end

    def publish(options = {})
      revisions.depublish_all

      draft.copy do |revision|
        revision.creator = options[:creator]
        revision.frozen_at = Time.now
        revision.published_at = Time.now
        revision.published_until = options[:published_until]
      end
    end

    def snapshot(options)
      draft.copy do |revision|
        revision.creator = options[:creator]
        revision.frozen_at = Time.now
        revision.snapshot_type = options.fetch(:type, 'auto')
      end
    end

    def restore(options)
      restored_revision = options.fetch(:revision)
      draft.update!(:frozen_at => Time.now, :creator => options[:creator], :snapshot_type => 'before_restore')

      restored_revision.copy do |revision|
        revision.restored_from = restored_revision
        revision.frozen_at = nil
        revision.published_at = nil
        revision.published_until = nil
      end
    end

    def published?
      published_revision.present?
    end

    def published_until
      published? ? published_revision.published_until : nil
    end

    def should_generate_new_friendly_id?
      slug.blank? || title_changed?
    end

    def slug_candidates
      [:title, [:title, :id]]
    end

    private

    def folder_belongs_to_same_account
      errors.add(:folder, :must_be_same_account) if folder.present? && folder.account_id != account_id
    end
  end
end
