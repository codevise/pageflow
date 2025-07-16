module Pageflow
  class FolderPolicy < ApplicationPolicy
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
          scope.where('account_id IN (?) OR id IN (?)',
                      accounts_where_user_is_at_least_previewer(user).map(&:id),
                      user.entries.map(&:folder_id))
        end
      end

      private

      def accounts_where_user_is_at_least_previewer(user)
        user.accounts
            .joins(
              sanitize_sql_array(
                [
                  'LEFT OUTER JOIN pageflow_memberships as pageflow_memberships_2 ON ' \
                    'pageflow_memberships_2.user_id = :user_id AND ' \
                    'pageflow_memberships_2.entity_type = \'Pageflow::Account\' AND ' \
                    'pageflow_memberships_2.entity_id = pageflow_accounts.id AND ' \
                    'pageflow_memberships_2.role IN (\'previewer\', ' \
                    "\'editor\', \'publisher\', \'manager\')",
                  {user_id: user.id}
                ]
              )
            )
            .where('pageflow_memberships_2.entity_id IS NOT NULL')
      end
    end

    def initialize(user, folder)
      @user = user
      @folder = folder
    end

    def manage?
      allows?(%w[publisher manager])
    end

    def show_account_selection_on?
      (@user.admin? && Account.all.size > 1) ||
        @user.memberships.as_publisher_or_above.on_accounts.size > 1
    end

    private

    def allows?(roles)
      @user.memberships.where(role: roles, entity: @folder.account).any?
    end
  end
end
