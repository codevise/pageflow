module Pageflow
  class EntryDuplicate < Struct.new(:original_entry)
    def create!
      create_entry

      copy_draft
      copy_memberships

      new_entry
    end

    def self.of(entry)
      new(entry)
    end

    private

    attr_reader :new_entry

    def create_entry
      @new_entry = Entry.create!(new_attributes)
    end

    def copy_draft
      original_entry.draft.copy do |revision|
        revision.entry = new_entry
      end
    end

    def copy_memberships
      original_entry.memberships.each do |membership|
        Membership.create(user: membership.user, role: membership.role.to_sym, entity: new_entry)
      end
    end

    def new_attributes
      {
        type_name: original_entry.type_name,
        title: new_title,
        account: original_entry.account,
        theming: original_entry.theming,
        features_configuration: original_entry.features_configuration,

        skip_draft_creation: true
      }
    end

    def new_title
      I18n.t('pageflow.entry.duplicated_title', title: original_entry.title)
    end
  end
end
