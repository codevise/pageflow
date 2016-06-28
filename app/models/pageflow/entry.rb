module Pageflow
  class Entry < ActiveRecord::Base
    class PasswordMissingError < StandardError
    end

    include FeatureTarget

    extend FriendlyId
    friendly_id :slug_candidates, :use => [:finders, :slugged]

    belongs_to :account, counter_cache: true
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

    has_one :draft, -> { editable }, :class_name => 'Revision'
    has_one :published_revision, -> { published }, :class_name => 'Revision'

    has_one :edit_lock, :dependent => :destroy

    has_secure_password validations: false

    validates :account, :theming, :presence => true
    validate :folder_belongs_to_same_account

    scope :published, -> { joins(:published_revision) }
    scope :editing, -> { joins(:edit_lock).merge(Pageflow::EditLock.active) }

    attr_accessor :skip_draft_creation

    after_create unless: :skip_draft_creation do
      create_draft!(home_button_enabled: theming.home_button_enabled_by_default)
      draft.storylines.create!(configuration: {main: true})
      theming.widgets.copy_all_to(draft)
    end

    def edit_lock
      super || EditLock::Null.new(self)
    end

    def inherited_feature_state(name)
      account.feature_state(name)
    end

    def publish(options = {})
      ActiveRecord::Base.transaction do
        self.first_published_at ||= Time.now
        update_password!(options.slice(:password, :password_protected))

        revisions.depublish_all
        association(:published_revision).reset

        draft.copy do |revision|
          revision.creator = options[:creator]
          revision.frozen_at = Time.now
          revision.published_at = Time.now
          revision.published_until = options[:published_until]
          revision.password_protected = options[:password_protected]
        end
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
        revision.password_protected = nil
      end
    end

    def duplicate
      EntryDuplicate.of(self).create!
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

    def update_password!(options)
      if options[:password].present?
        self.password = options[:password]
      end

      if options[:password_protected]
        raise PasswordMissingError if password_digest.blank?
      else
        self.password_digest = nil
      end

      save!
    end
  end
end
