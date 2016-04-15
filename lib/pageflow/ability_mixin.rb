module Pageflow
  # Defines the default abilities for the Pageflow models.
  module AbilityMixin
    # Call this in the ability initializer.
    def pageflow_default_abilities(user)
      return if user.nil?

      can :view, [Admin::MembersTab, Admin::RevisionsTab]
      unless user.admin?
        can [:create, :update, :destroy], Folder do |folder|
          Policies::FolderPolicy.new(user, folder).manage?
        end

        can :configure_folder_on, Account do |account|
          Policies::AccountPolicy.new(user, account).configure_folder_on?
        end

        can :configure_folder_for, Entry do |entry|
          Policies::AccountPolicy.new(user, entry.account).configure_folder_on?
        end

        can :read, Folder, Policies::FolderPolicy::Scope.new(user, Folder).resolve

        can :use_files, Entry, Policies::EntryPolicy::Scope.new(user, Entry).resolve do |entry|
          Policies::EntryPolicy.new(user, entry).use_files?
        end

        can :read, Entry, Policies::EntryPolicy::Scope.new(user, Entry).resolve do |entry|
          Policies::EntryPolicy.new(user, entry).read?
        end

        can :create, Entry do |entry|
          Policies::EntryPolicy.new(user, entry).create?
        end

        can :duplicate, Entry do |entry|
          Policies::EntryPolicy.new(user, entry).duplicate?
        end

        can :update, Entry do |entry|
          Policies::EntryPolicy.new(user, entry).edit?
        end

        can :snapshot, Entry do |entry|
          Policies::EntryPolicy.new(user, entry).snapshot?
        end

        can :confirm_encoding, Entry do |entry|
          Policies::EntryPolicy.new(user, entry).confirm_encoding?
        end

        can :update_account_on, Entry do |entry|
          Policies::EntryPolicy.new(user, entry).update_account_on?
        end

        can :update_theming_on, Entry do |entry|
          Policies::EntryPolicy.new(user, entry).update_theming_on?
        end

        can :update_theming_on_entry_of, Account do |account|
          Policies::AccountPolicy.new(user, account).update_theming_on_entry_of?
        end

        can :update_feature_configuration_on, Entry do |entry|
          Policies::EntryPolicy.new(user, entry).update_feature_configuration_on?
        end

        can :restore, Entry do |entry|
          Policies::EntryPolicy.new(user, entry).restore?
        end

        can :add_member_to, Entry do |entry|
          Policies::EntryPolicy.new(user, entry).add_member_to?
        end

        can :edit_outline, Entry do |entry|
          Policies::EntryPolicy.new(user, entry).edit_outline?
        end

        can :manage, Storyline do |storyline|
          Policies::EntryPolicy.new(user, storyline.revision.entry).edit?
        end

        can :manage, Chapter do |record|
          Policies::EntryPolicy.new(user, record.entry).edit?
        end

        can [:retry, :update], Pageflow.config.file_types.map(&:model) do |record|
          Policies::FilePolicy.new(user, record).manage?
        end

        can :use, Pageflow.config.file_types.map(&:model) do |record|
          Policies::FilePolicy.new(user, record).use?
        end

        can :manage, Page do |page|
          Policies::EntryPolicy.new(user, page.chapter.entry).edit?
        end

        can :read, Revision do |revision|
          Policies::EntryPolicy.new(user, revision.entry).preview?
        end

        can :edit, Theming do |theming|
          Policies::ThemingPolicy.new(user, theming).edit?
        end

        can :publish, Entry do |entry|
          Policies::EntryPolicy.new(user, entry).publish?
        end

        can :index_widgets_for, Theming do |theming|
          Policies::ThemingPolicy.new(user, theming).index_widgets_for?
        end

        can :index_widgets_for, Entry do |entry|
          Policies::EntryPolicy.new(user, entry).index_widgets_for?
        end

        can :destroy, Entry do |entry|
          Policies::EntryPolicy.new(user, entry).destroy?
        end
      end

      if user.admin?
        can [:read, :create, :update, :configure_folder_on], Account
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
      end
    end
  end
end
