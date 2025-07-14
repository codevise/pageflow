module Pageflow
  # Defines the default abilities for the Pageflow models.
  module AbilityMixin
    include ActiveAdminCanCanFix

    # Call this in the ability initializer.
    def pageflow_default_abilities(user)
      return if user.nil?

      can :read, Account, AccountPolicy::Scope.new(user, Account).resolve do |account|
        AccountPolicy.new(user, account).read?
      end

      can :update, Account do |account|
        AccountPolicy.new(user, account).update?
      end

      can :update_feature_configuration_on, Account do |account|
        AccountPolicy.new(user, account).update_feature_configuration_on?
      end

      can :add_member_to, Account do |account|
        AccountPolicy.new(user, account).add_member_to?
      end

      can :see_user_quota, Account do |account|
        AccountPolicy.new(user, account).see_user_quota?
      end

      can :see_badge_belonging_to, Account do |account|
        AccountPolicy.new(user, account).see_badge_belonging_to?
      end

      can :create, Membership, Membership.all do |membership|
        membership.entity.nil? ||
          membership.user.nil? ||
          !(membership.user.entries.include?(membership.entity) ||
             membership.user.accounts.include?(membership.entity)) &&
            MembershipPolicy.new(user, membership).create?
      end

      can :index, Membership, MembershipPolicy::Scope.new(user, Membership).indexable

      can :update, Membership do |membership|
        MembershipPolicy.new(user, membership).edit_role?
      end

      can :destroy, Membership do |membership|
        MembershipPolicy.new(user, membership).destroy?
      end

      can :index, :users do
        UserPolicy.new(user, User.new).index?
      end

      can :create_any, :users do
        UserPolicy.new(user, User.new).create_any?
      end

      can :add_account_to, :users do
        UserPolicy.new(user, User.new).add_account_to?
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

      can :index, :entries

      can :create_any, :entries do
        EntryPolicy.new(user, Entry.new).create_any?
      end

      can :filter_by_type, :entries do
        EntryPolicy.new(user, Entry).filter_by_type?
      end

      can :see_own_role_on, :entries do
        !user.admin?
      end

      can :see_entry_admin_tab, Admin::Tab do |tab|
        Admin::EntryTabPolicy.new(user, tab).see?
      end

      can :see_site_admin_tab, Admin::Tab do |tab|
        Admin::AdminOnlyTabPolicy.new(user, tab).see?
      end

      can :see_account_admin_tab, Admin::Tab do |tab|
        Admin::AdminOnlyTabPolicy.new(user, tab).see?
      end

      can :see_user_admin_tab, Admin::Tab do |tab|
        Admin::AdminOnlyTabPolicy.new(user, tab).see?
      end

      can :see_entry_types, Account do |account|
        AccountPolicy.new(user, account).see_entry_types?
      end

      can :manage, ActiveAdmin::Page, name: 'Site Root Entry'

      can :manage_root_entry, Site do |site|
        SitePolicy.new(user, site).manage_root_entry?
      end

      unless user.admin?
        can :configure_folder_on, Account do |account|
          AccountPolicy.new(user, account).configure_folder_on?
        end

        can :update_site_on_entry_of, Account do |account|
          AccountPolicy.new(user, account).update_site_on_entry_of?
        end

        can :create, Entry, Entry.all do |entry|
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

        can :manage_translations, Entry do |entry|
          EntryPolicy.new(user, entry).manage_translations?
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

        can :update_site_on, Entry do |entry|
          EntryPolicy.new(user, entry).update_site_on?
        end

        can :use_files, Entry, EntryPolicy::Scope.new(user, Entry).resolve do |entry|
          EntryPolicy.new(user, entry).use_files?
        end

        can [:retry, :update], Pageflow.config.file_types.map(&:model) do |record|
          FilePolicy.new(user, record).manage?
        end

        can :destroy, Pageflow.config.file_types.map(&:model) do |record|
          FilePolicy.new(user, record).destroy?
        end

        can :use, Pageflow.config.file_types.map(&:model) do |record|
          FilePolicy.new(user, record).use?
        end

        can [:create, :update, :destroy], Folder, Folder.all do |folder|
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

        can :read, Site do |site|
          SitePolicy.new(user, site).read?
        end

        can :update, Site do |site|
          SitePolicy.new(user, site).update?
        end

        can :create, EntryTemplate, EntryTemplate.all do |entry_template|
          EntryTemplatePolicy.new(user, entry_template).create?
        end

        can :update, EntryTemplate do |entry_template|
          EntryTemplatePolicy.new(user, entry_template).update?
        end

        can :create, ::User, ::User.all do |managed_user|
          UserPolicy.new(user, managed_user).create?
        end

        can :read, ::User, UserPolicy::Scope.new(user, ::User).resolve do |managed_user|
          UserPolicy.new(user, managed_user).read?
        end

        can :see_admin_status, ::User do |managed_user|
          UserPolicy.new(user, managed_user).see_admin_status?
        end

        can :redirect_to_user,
            ::User,
            UserPolicy::Scope.new(user, ::User).resolve do |managed_user|
          UserPolicy.new(user, managed_user).redirect_to_user?
        end

        can :suspend, ::User do |managed_user|
          UserPolicy.new(user, managed_user).suspend?
        end

        can :destroy, ::User do |managed_user|
          UserPolicy.new(user, managed_user).destroy?
        end
      end

      can :delete_own_user, ::User do |user_to_delete|
        UserPolicy.new(user, user_to_delete).delete_own_user?
      end

      return unless user.admin?

      can [:create, :configure_folder_on], Account
      can :create_any, :accounts
      can :destroy, Account do |account|
        account.users.empty? && account.entries.empty?
      end
      can :manage, [Storyline, Chapter, Page]
      can :manage, [Entry, Revision]
      can :manage, Pageflow.config.file_types.map(&:model)
      can :manage, Folder
      can :manage, Site
      can :manage, EntryTemplate
      can :manage, ::User
    end
  end
end
