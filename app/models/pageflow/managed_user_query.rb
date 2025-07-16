module Pageflow
  # @api private
  class ManagedUserQuery < ApplicationQuery
    class Scope < Scope # rubocop:todo Style/Documentation
      def initialize(current_user, scope)
        @current_user = current_user
        @scope = scope
      end

      def resolve
        if current_user.admin?
          scope.all
        else
          scope
            .distinct
            .joins(account_memberships)
            .joins(account_manager_memberships_of_current_user)
        end
      end

      private

      attr_reader :current_user, :scope

      def account_memberships
        <<-SQL
          INNER JOIN pageflow_memberships account_memberships ON
          account_memberships.user_id = users.id AND
          account_memberships.entity_type = 'Pageflow::Account'
        SQL
      end

      def account_manager_memberships_of_current_user
        sanitize_sql(<<-SQL, user_id: current_user.id)
          INNER JOIN pageflow_memberships account_manager_memberships ON
          account_manager_memberships.entity_type = account_memberships.entity_type AND
          account_manager_memberships.entity_id = account_memberships.entity_id AND
          account_manager_memberships.user_id = :user_id AND
          account_manager_memberships.role = "manager"
        SQL
      end
    end
  end
end
