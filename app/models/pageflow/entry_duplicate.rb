module Pageflow
  # @api private
  class EntryDuplicate
    attr_reader :original_entry, :new_entry

    def self.of(entry, attributes: {}, copy_memberships: true)
      new(entry, attributes:, copy_memberships:)
    end

    def initialize(original_entry, attributes: {}, copy_memberships: true)
      @original_entry = original_entry
      @copy_memberships = copy_memberships
      @new_entry = build_entry(attributes)
    end

    def copy_memberships?
      @copy_memberships
    end

    def save
      passed_slug = new_entry.permalink&.slug

      saved = ActiveRecord::Base.transaction do
        next false unless new_entry.save

        copy_draft
        copy_memberships if copy_memberships?

        true
      end

      new_entry.permalink.slug = passed_slug if !saved && new_entry.permalink
      saved
    end

    def create!
      raise ActiveRecord::RecordInvalid, new_entry unless save

      new_entry
    end

    private

    def build_entry(attributes)
      Entry.new(default_attributes).tap do |entry|
        entry.assign_attributes(attributes)

        entry.site = entry.account.default_site if entry.site.account_id != entry.account_id
        entry.folder = nil if entry.folder && entry.folder.account_id != entry.account_id

        build_permalink_in_original_directory(entry) unless entry.permalink
      end
    end

    def build_permalink_in_original_directory(entry)
      directory = original_entry.permalink&.directory
      return unless directory && directory.site_id == entry.site_id

      entry.build_permalink(directory:, slug: '')
    end

    def copy_draft
      original_entry.draft.copy do |revision|
        revision.entry = new_entry
      end
    end

    def copy_memberships
      memberships_of_target_account_members.each do |membership|
        Membership.create!(user: membership.user, role: membership.role.to_sym, entity: new_entry)
      end
    end

    def memberships_of_target_account_members
      original_entry
        .memberships
        .where(user_id: new_entry.account.memberships.select(:user_id))
    end

    def default_attributes
      {
        type_name: original_entry.type_name,
        title: default_title,
        account: original_entry.account,
        site: original_entry.site,
        folder: original_entry.folder,
        features_configuration: original_entry.features_configuration,
        perma_id_counter: original_entry.perma_id_counter,

        skip_draft_creation: true
      }
    end

    def default_title
      I18n.t('pageflow.entry.duplicated_title', title: original_entry.title)
    end
  end
end
