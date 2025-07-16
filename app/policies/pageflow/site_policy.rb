module Pageflow
  # @api private
  class SitePolicy < ApplicationPolicy
    # @api private
    class Scope < Scope
      attr_reader :user, :scope

      def initialize(user, scope)
        @user = user
        @scope = scope
      end

      def sites_allowed_for(accounts)
        if user.admin?
          scope.all
        else
          accounts_ids = accounts.try(:id) || accounts.try(:length) && accounts.map(&:id)
          scope.joins(publisher_memberships_for_accounts(user, accounts_ids))
               .where(membership_is_present)
        end
      end

      private

      def publisher_memberships_for_accounts(user, accounts_ids)
        sanitize_sql_array(['LEFT OUTER JOIN pageflow_memberships ON ' \
                            'pageflow_memberships.user_id = :user_id AND ' \
                            'pageflow_sites.account_id IN (:accounts_ids) AND ' \
                            'pageflow_memberships.entity_id IN (:accounts_ids) AND ' \
                            'pageflow_memberships.entity_type = \'Pageflow::Account\' AND ' \
                            'pageflow_memberships.role IN (\'publisher\', \'manager\')',
                            {user_id: user.id, accounts_ids:}])
      end

      def membership_is_present
        'pageflow_memberships.entity_id IS NOT NULL'
      end
    end

    attr_reader :user

    def initialize(user, site)
      @user = user
      @account_role_query = AccountRoleQuery.new(user, site.account)
    end

    def read?
      @user.admin? ||
        (@account_role_query.has_at_least_role?(:manager) &&
         Pageflow.config.allow_multiaccount_users)
    end

    def update?
      read?
    end

    def manage_root_entry?
      @user.admin? ||
        @account_role_query.has_at_least_role?(:manager)
    end
  end
end
