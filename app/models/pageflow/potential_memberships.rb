module Pageflow
  # @api private
  class PotentialMemberships
    def initialize(current_user)
      @current_user = current_user
    end

    def self.creatable_by(user)
      new(user)
    end

    def accounts_for_user(user)
      exclude_accounts_with_membership(user, managed_accounts)
    end

    def entries_for_user(user)
      exclude_entries_with_membership(user, entries_managed_by_current_user_in_accounts_of(user))
    end

    def users_for_account(account)
      exclude_users_with_membership(account, users_of_managed_accounts)
    end

    def users_for_entry(entry)
      return User.none unless manages_entry?(entry)

      exclude_users_with_membership(entry, entry.account.users)
    end

    private

    def managed_accounts
      if @current_user.admin?
        Account.all
      else
        AccountRoleQuery::Scope
          .new(@current_user, Account)
          .with_role_at_least(:manager)
      end
    end

    def entries_managed_by_current_user_in_accounts_of(user)
      EntryRoleQuery::Scope
        .new(user, entries_managed_by_current_user, table_alias_prefix: 'member')
        .with_account_role_at_least(:member)
    end

    def entries_managed_by_current_user
      if @current_user.admin?
        Entry.all
      else
        EntryRoleQuery::Scope
          .new(@current_user, Entry, table_alias_prefix: 'manager')
          .with_role_at_least(:manager)
      end
    end

    def users_of_managed_accounts
      ManagedUserQuery::Scope
        .new(@current_user, User)
        .resolve
    end

    def manages_entry?(entry)
      @current_user.admin? ||
        EntryRoleQuery.new(@current_user, entry).has_at_least_role?(:manager)
    end

    def exclude_accounts_with_membership(user, accounts)
      accounts
        .joins(existing_memberships_of(user, Account))
        .where(existing_membership_is_missing)
    end

    def exclude_entries_with_membership(user, entries)
      entries
        .joins(existing_memberships_of(user, Entry))
        .where(existing_membership_is_missing)
    end

    def exclude_users_with_membership(entity, users)
      users
        .joins(existing_memberships_on(entity))
        .where(existing_membership_is_missing)
    end

    def existing_memberships_of(user, entity_model)
      sanitize_sql_array(['LEFT OUTER JOIN pageflow_memberships existing_memberships ON ' \
                          'existing_memberships.user_id = :user_id AND ' \
                          "existing_memberships.entity_id = #{entity_model.table_name}.id AND " \
                          'existing_memberships.entity_type = :entity_type',
                          {user_id: user.id,
                           entity_type: entity_model.name}])
    end

    def existing_memberships_on(entity)
      sanitize_sql_array(['LEFT OUTER JOIN pageflow_memberships existing_memberships ON ' \
                          'existing_memberships.user_id = users.id AND ' \
                          'existing_memberships.entity_id = :entity_id AND ' \
                          'existing_memberships.entity_type = :entity_type',
                          {entity_id: entity.id,
                           entity_type: entity.class.name}])
    end

    def existing_membership_is_missing
      'existing_memberships.id IS NULL'
    end

    def sanitize_sql_array(array)
      ActiveRecord::Base.send(:sanitize_sql_array, array)
    end
  end
end
