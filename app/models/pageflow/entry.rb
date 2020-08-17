module Pageflow
  class Entry < ApplicationRecord
    class PasswordMissingError < StandardError
    end

    include FeatureTarget
    include EntryPublicationStates
    include SerializationBlacklist

    extend FriendlyId
    friendly_id :slug_candidates, :use => [:finders, :slugged]

    belongs_to :account, counter_cache: true
    belongs_to :folder, optional: true
    belongs_to :theming

    has_many :revisions, -> { order('frozen_at DESC') }

    has_many :chapters, -> { order('pageflow_chapters.position ASC') }, :through => :revisions
    has_many :pages, -> { order('pageflow_chapters.position ASC, pageflow_pages.position ASC') }, :through => :chapters

    has_many :memberships, as: :entity, dependent: :destroy
    has_many :users, :through => :memberships, :class_name => '::User'

    has_many :image_files
    has_many :video_files
    has_many :audio_files

    has_many :imports, class_name: 'Pageflow::FileImport', dependent: :destroy

    has_one :draft, -> { editable }, :class_name => 'Revision'
    has_one :published_revision, -> { published }, :class_name => 'Revision'

    has_one :edit_lock, :dependent => :destroy

    has_secure_password validations: false

    validates :account, :theming, :presence => true
    validates :title, presence: true
    validate :entry_type_is_available_for_account
    validate :folder_belongs_to_same_account

    scope :editing, -> { joins(:edit_lock).merge(Pageflow::EditLock.active) }

    scope(:include_account_name,
          lambda do
            joins(:account).select('pageflow_entries.*, pageflow_accounts.name AS account_name')
          end)

    attr_accessor :skip_draft_creation

    after_create unless: :skip_draft_creation do
      create_draft!
      draft.storylines.create!(configuration: {main: true})
      entry_template.copy_defaults_to(draft)
    end

    def entry_template
      @entry_template ||= EntryTemplate.find_or_initialize_by(
        account_id: account.id,
        entry_type_name: type_name
      )
    end

    def entry_type
      Pageflow.config.entry_types.find_by_name!(type_name)
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
        revision.snapshot_type = nil
        revision.published_at = nil
        revision.published_until = nil
        revision.password_protected = nil
      end
    end

    def duplicate
      EntryDuplicate.of(self).create!
    end

    def should_generate_new_friendly_id?
      slug.blank? || title_changed?
    end

    def slug_candidates
      [:title, [:title, :id]]
    end

    def self.ransackable_scopes(_)
      [:with_publication_state, :published]
    end

    def blacklist_for_serialization
      [:password_digest, :features_configuration]
    end

    private

    def folder_belongs_to_same_account
      errors.add(:folder, :must_be_same_account) if folder.present? && folder.account_id != account_id
    end

    def entry_type_is_available_for_account
      return if Pageflow.config_for(account).entry_types.map(&:name).include?(type_name)

      errors.add(:type_name, :must_be_available_for_account, type_name: type_name)
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
