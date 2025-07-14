module Pageflow
  class UserPolicy < ApplicationPolicy
    class Scope < Scope
      attr_reader :user, :scope

      def initialize(user, scope)
        @user = user
        @scope = scope
      end

      def resolve
        if user.admin?
          scope.all
        else
          manager_accounts_ids = AccountPolicy::Scope
                                 .new(@user, Account).member_addable.map(&:id)

          scope.joins(:memberships)
               .where('pageflow_memberships.entity_type = \'Pageflow::Account\'')
               .where(membership_in_managed_account(manager_accounts_ids)).distinct
        end
      end

      private

      def membership_in_managed_account(accounts_ids)
        sanitize_sql_array(['pageflow_memberships.entity_id IN (:accounts_ids)',
                            {accounts_ids:}])
      end
    end

    attr_reader :user

    def initialize(user, managed_user)
      @user = user
      @managed_user = managed_user
    end

    def create_any?
      index?
    end

    def create?
      index?
    end

    def index?
      @user.admin? ||
        @user.memberships.on_accounts.where(role: 'manager').any?
    end

    def add_account_to?
      Pageflow.config.allow_multiaccount_users
    end

    def read?
      manager_accounts = AccountPolicy::Scope
                         .new(@user, Account).member_addable
      managed_user_accounts = AccountPolicy::Scope
                              .new(@managed_user, Account).resolve
      (manager_accounts & managed_user_accounts).any?
    end

    def redirect_to_user?
      read?
    end

    def suspend?
      deny_sign_in?
    end

    def destroy?
      deny_sign_in?
    end

    def admin?
      @user.admin?
    end

    def set_admin?
      admin?
    end

    def see_admin_status?
      if permissions_config.only_admins_may_see_admin_boolean
        admin?
      else
        read?
      end
    end

    def delete_own_user?
      Pageflow.config.authorize_user_deletion.call(@managed_user) == true
    end

    private

    attr_reader :managed_user

    def deny_sign_in?
      if Pageflow.config.allow_multiaccount_users
        user.admin?
      else
        AccountRoleQuery.new(user, managed_user.accounts.first).has_at_least_role?(:manager)
      end
    end
  end
end
