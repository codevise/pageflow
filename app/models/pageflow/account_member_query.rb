module Pageflow
  # Query accounts for members, e.g. based on role
  class AccountMemberQuery < ApplicationQuery
    class Scope < ApplicationQuery::Scope # rubocop:todo Style/Documentation
      # Account whose members we scope
      # @return [Pageflow::Account]
      attr_reader :account

      # Base scope which is further scoped according to account role
      # @return [ActiveRecord::Relation<User>]
      attr_reader :scope

      # Create scope that can limit base scope to account members at
      # or above a given role
      #
      # @param [Pageflow::Account] account
      #   Required. Membership account to check.
      # @param [ActiveRecord::Relation<User>] scope
      #   Optional. Membership entity to check.
      def initialize(account, scope = User.all)
        @account = account
        @scope = scope
      end

      # Scope to those members from scope on account who have at least
      # role
      #
      # @param [String] role
      #   Required. Minimum role that we compare against.
      # @return [ActiveRecord::Relation<User>]
      def with_role_at_least(role)
        scope.joins(memberships_for_account_with_at_least_role(role))
             .where(membership_is_present)
      end

      private

      def memberships_for_account_with_at_least_role(role)
        options = {roles: Roles.at_least(role), account_id: account.id}

        sanitize_sql(<<-SQL, options)
          LEFT OUTER JOIN pageflow_memberships as
            pageflow_account_memberships ON
          pageflow_account_memberships.user_id = users.id AND
          pageflow_account_memberships.role IN (:roles) AND
          pageflow_account_memberships.entity_id = :account_id AND
          pageflow_account_memberships.entity_type = 'Pageflow::Account'
        SQL
      end

      def membership_is_present
        'pageflow_account_memberships.entity_id IS NOT NULL'
      end
    end
  end
end
