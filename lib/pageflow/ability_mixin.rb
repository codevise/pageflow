module Pageflow
  # Defines the default abilities for the Pageflow models.
  module AbilityMixin
    # Call this in the ability initializer.
    def pageflow_default_abilities(user)
      return if user.nil?

      can :read, Account, AccountPolicy::Scope.new(user, Account).resolve do |account|
        AccountPolicy.new(user, account).read?
      end

      can :update, Account do |account|
        AccountPolicy.new(user, account).update?
      end

      can :index, Account do |account|
        AccountPolicy.new(user, account).index?
      end

      can :add_member_to, Account do |account|
        AccountPolicy.new(user, account).add_member_to?
      end

      can :see_all_instances_of_class_of, Account do |account|
        AccountPolicy.new(user, account).see_all_instances_of_class_of?
      end

      can :see_badge_belonging_to, Account do |account|
        AccountPolicy.new(user, account).see_badge_belonging_to?
      end

      can :create, Membership do |membership|
        membership.entity.nil? ||
          membership.user.nil? ||
          (!(membership.user.entries.include?(membership.entity) ||
             membership.user.accounts.include?(membership.entity))) &&
            MembershipPolicy.new(user, membership).create?
      end

      can :index, Membership, MembershipPolicy::Scope.new(user, Membership).indexable

      can :update, Membership do |membership|
        MembershipPolicy.new(user, membership).edit_role?
      end

      can :destroy, Membership do |membership|
        MembershipPolicy.new(user, membership).destroy?
      end

      can :set_admin, ::User do |managed_user|
        UserPolicy.new(user, managed_user).set_admin?
      end

      can :see, :accounts do
        user.admin? || user.memberships.on_accounts.length > 1
      end

      can :see_own_role_on, :accounts do
        !user.admin?
      end

      can :index, :accounts do
        AccountPolicy.new(user, Account.new).index?
      end

      can :see_own_role_on, :entries do
        !user.admin?
      end

      can :see_entry_admin_tab, Admin::Tab do |tab|
        Admin::EntryTabPolicy.new(user, tab).see?
      end

      can :see_theming_admin_tab, Admin::Tab do |tab|
        Admin::AdminOnlyTabPolicy.new(user, tab).see?
      end

      can :see_user_admin_tab, Admin::Tab do |tab|
        Admin::AdminOnlyTabPolicy.new(user, tab).see?
      end

      unless user.admin?
        can :configure_folder_on, Account do |account|
          AccountPolicy.new(user, account).configure_folder_on?
        end

        can :update_theming_on_entry_of, Account do |account|
          AccountPolicy.new(user, account).update_theming_on_entry_of?
        end

        can :create, Entry do |entry|
          EntryPolicy.new(user, entry).create?
        end

        can :manage, Chapter do |record|
          EntryPolicy.new(user, record.entry).edit?
        end

        can :read, Entry, EntryPolicy::Scope.new(user, Entry).resolve do |entry|
          EntryPolicy.new(user, entry).read?
        end

        can :update, Entry do |entry|
          EntryPolicy.new(user, entry).edit?
        end

        can :destroy, Entry do |entry|
          EntryPolicy.new(user, entry).destroy?
        end

        can :add_member_to, Entry do |entry|
          EntryPolicy.new(user, entry).add_member_to?
        end

        can :configure_folder_for, Entry do |entry|
          AccountPolicy.new(user, entry.account).configure_folder_on?
        end

        can :confirm_encoding, Entry do |entry|
          EntryPolicy.new(user, entry).confirm_encoding?
        end

        can :duplicate, Entry do |entry|
          EntryPolicy.new(user, entry).duplicate?
        end

        can :edit_outline, Entry do |entry|
          EntryPolicy.new(user, entry).edit_outline?
        end

        can :index_widgets_for, Entry do |entry|
          EntryPolicy.new(user, entry).index_widgets_for?
        end

        can :publish, Entry do |entry|
          EntryPolicy.new(user, entry).publish?
        end

        can :restore, Entry do |entry|
          EntryPolicy.new(user, entry).restore?
        end

        can :snapshot, Entry do |entry|
          EntryPolicy.new(user, entry).snapshot?
        end

        can :update_account_on, Entry do |entry|
          EntryPolicy.new(user, entry).update_account_on?
        end

        can :update_feature_configuration_on, Entry do |entry|
          EntryPolicy.new(user, entry).update_feature_configuration_on?
        end

        can :update_theming_on, Entry do |entry|
          EntryPolicy.new(user, entry).update_theming_on?
        end

        can :use_files, Entry, EntryPolicy::Scope.new(user, Entry).resolve do |entry|
          EntryPolicy.new(user, entry).use_files?
        end

        can [:retry, :update], Pageflow.config.file_types.map(&:model) do |record|
          FilePolicy.new(user, record).manage?
        end

        can :use, Pageflow.config.file_types.map(&:model) do |record|
          FilePolicy.new(user, record).use?
        end

        can [:create, :update, :destroy], Folder do |folder|
          FolderPolicy.new(user, folder).manage?
        end

        can :read, Folder, FolderPolicy::Scope.new(user, Folder).resolve

        can :show_account_selection_on, Folder do |folder|
          FolderPolicy.new(user, folder).show_account_selection_on?
        end

        can :manage, Page do |page|
          EntryPolicy.new(user, page.chapter.entry).edit?
        end

        can :read, Revision do |revision|
          EntryPolicy.new(user, revision.entry).preview?
        end

        can :manage, Storyline do |storyline|
          EntryPolicy.new(user, storyline.revision.entry).edit?
        end

        can :edit, Theming do |theming|
          ThemingPolicy.new(user, theming).edit?
        end

        can :index_widgets_for, Theming do |theming|
          ThemingPolicy.new(user, theming).index_widgets_for?
        end

        can :create, ::User do |managed_user|
          UserPolicy.new(user, managed_user).create?
        end

        can :index, ::User, UserPolicy::Scope.new(user, ::User).resolve do |managed_user|
          UserPolicy.new(user, managed_user).index?
        end

        can :read, ::User, UserPolicy::Scope.new(user, ::User).resolve do |managed_user|
          UserPolicy.new(user, managed_user).read?
        end

        can :redirect_to_user,
            ::User,
            UserPolicy::Scope.new(user, ::User).resolve do |managed_user|
          UserPolicy.new(user, managed_user).redirect_to_user?
        end
      end

      can :delete_own_user, ::User do |user_to_delete|
        Pageflow.config.authorize_user_deletion.call(user_to_delete) == true
      end

      if user.admin?
        can [:create, :configure_folder_on], Account
        can :destroy, Account do |account|
          account.users.empty? && account.entries.empty?
        end
        can :manage, [Storyline, Chapter, Page]
        can :manage, [Entry, Revision]
        can :manage, Pageflow.config.file_types.map(&:model)
        can :manage, Folder
        can :manage, Resque
        can :manage, Theming
        can :manage, ::User
      end
    end
  end
end
