module Pageflow
  # Defines the default abilities for the Pageflow models.
  module AbilityMixin
    # Call this in the ability initializer.
    def pageflow_default_abilities(user)
      return if user.nil?

      can :view, [Admin::MembersTab, Admin::RevisionsTab]

      unless user.admin?

        can :read, Folder, id: user.entries.map(&:folder_id)

        can :use_files, Entry, id: user.entry_ids

        can :read, Entry, Policies::EntryPolicy::Scope.new(user, Entry).resolve do |entry|
          Policies::EntryPolicy.new(user, entry).read?
        end

        can [:create, :duplicate], Entry do |entry|
          Policies::EntryPolicy.new(user, entry).publish?
        end

        can [:edit,
             :update,
             :edit_outline,
             :publish,
             :restore,
             :snapshot,
             :confirm_encoding], Entry do |entry|
          can_edit_entry?(user, entry)
        end

        can :add_member_to, Entry do |entry|
          Policies::EntryPolicy.new(user, entry).configure?
        end

        can :manage, Storyline do |storyline|
          Policies::EntryPolicy.new(user, storyline.revision.entry).edit?
        end

        can :manage, Chapter do |record|
          Policies::EntryPolicy.new(user, record.entry).edit?
        end

        can :manage, Pageflow.config.file_types.map(&:model) do |record|
          can_edit_any_entry_using_file?(user, record)
        end

        can :manage, Page do |page|
          Policies::EntryPolicy.new(user, page.chapter.entry).edit?
        end

        can :read, Revision do |revision|
          Policies::EntryPolicy.new(user, revision.entry).preview?
        end

      end

      if user.admin?
        can [:read, :create, :update], Account
        can :destroy, Account do |account|
          account.users.empty? && account.entries.empty?
        end
        can :manage, Theming

        can :manage, ::User

        can :destroy, Membership
        can :create, Membership do |membership|
          membership.entry.nil? ||
            membership.user.nil? ||
            membership.entry.account == membership.user.account
        end

        can :view, Admin::FeaturesTab

        can :manage, Folder
        can :manage, [Entry, Revision]
        can :manage, [Storyline, Chapter, Page]
        can :manage, Pageflow.config.file_types.map(&:model)

        can :manage, Resque
      elsif user.account_manager?
        can :manage, Theming, :account_id => user.account_id
        can :manage, Folder, :account_id => user.account.id
        can [:edit,
             :update,
             :edit_outline,
             :publish,
             :restore,
             :snapshot,
             :confirm_encoding,
             :use_files,
             :destroy], Entry, account_id: user.account.id
        can :manage, ::User, :account_id => user.account.id
        can :manage, Revision, :entry => {:account_id => user.account.id}

        can :destroy, Membership, :entry => {:account_id => user.account.id}
        can :destroy, Membership, :user => {:account_id => user.account.id}

        can :create, Membership do |membership|
          (membership.entry.nil? || membership.entry.account == user.account) &&
            (membership.user.nil? || membership.user.account == user.account)
        end
      end
    end

    private

    def can_edit_entry?(user, entry)
      user.entries.include?(entry) || account_manager_of_entries_account?(user, entry)
    end

    def account_manager_of_entries_account?(user, entry)
      user.account_manager? && entry.account_id == user.account_id
    end

    def can_edit_any_entry_using_file?(user, file)
      member_of_any_entry_using_file?(user, file) || account_manager_of_account_using_file?(user, file)
    end

    def member_of_any_entry_using_file?(user, file)
      (user.entry_ids & file.using_entry_ids).any?
    end

    def account_manager_of_account_using_file?(user, file)
      user.account_manager? && file.using_account_ids.include?(user.account_id)
    end
  end
end
