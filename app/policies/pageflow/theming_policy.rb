module Pageflow
  class ThemingPolicy < ApplicationPolicy
    class Scope < Scope
      attr_reader :user, :scope

      def initialize(user, scope)
        @user = user
        @scope = scope
      end

      def themings_allowed_for(accounts)
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
                            'pageflow_themings.account_id IN (:accounts_ids) AND ' \
                            'pageflow_memberships.entity_id IN (:accounts_ids) AND ' \
                            'pageflow_memberships.entity_type = "Pageflow::Account" AND ' \
                            'pageflow_memberships.role IN ("publisher", "manager")',
                            user_id: user.id, accounts_ids: accounts_ids])
      end

      def membership_is_present
        'pageflow_memberships.entity_id IS NOT NULL'
      end
    end

    def initialize(user, theming)
      @user = user
      @theming = theming
    end

    def edit?
      allows?(%w(publisher manager))
    end

    private

    def allows?(roles)
      @user.memberships.where(role: roles, entity: @theming.account).any?
    end
  end
end
