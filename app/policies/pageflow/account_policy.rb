module Pageflow
  class AccountPolicy < ApplicationPolicy
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
          scope.joins(memberships_for_account(user)).where(membership_is_present)
        end
      end

      def entry_creatable
        if user.admin?
          scope.all
        else
          scope.joins(publisher_memberships_for_account(user)).where(membership_is_present)
        end
      end

      def entry_movable
        entry_creatable
      end

      def themings_accessible
        entry_creatable
      end

      def folder_addable
        entry_creatable
      end

      def member_addable
        if user.admin?
          scope.all
        else
          scope.joins(manager_memberships_for_account(user)).where(membership_is_present)
        end
      end

      private

      def memberships_for_account(user)
        sanitize_sql_array(['LEFT OUTER JOIN pageflow_memberships ON ' \
                            'pageflow_memberships.user_id = :user_id AND ' \
                            'pageflow_memberships.entity_id = pageflow_accounts.id AND ' \
                            'pageflow_memberships.entity_type = "Pageflow::Account" AND ' \
                            'pageflow_memberships.role IN '\
                            '("member", "previewer", "editor", "publisher", "manager")',
                            user_id: user.id])
      end

      def publisher_memberships_for_account(user)
        sanitize_sql_array(['LEFT OUTER JOIN pageflow_memberships ON ' \
                            'pageflow_memberships.user_id = :user_id AND ' \
                            'pageflow_memberships.entity_id = pageflow_accounts.id AND ' \
                            'pageflow_memberships.entity_type = "Pageflow::Account" AND ' \
                            'pageflow_memberships.role IN ("publisher", "manager")',
                            user_id: user.id])
      end

      def manager_memberships_for_account(user)
        sanitize_sql_array(['LEFT OUTER JOIN pageflow_memberships ON ' \
                            'pageflow_memberships.user_id = :user_id AND ' \
                            'pageflow_memberships.entity_id = pageflow_accounts.id AND ' \
                            'pageflow_memberships.entity_type = "Pageflow::Account" AND ' \
                            'pageflow_memberships.role IN ("manager")',
                            user_id: user.id])
      end

      def membership_is_present
        'pageflow_memberships.entity_id IS NOT NULL'
      end
    end

    attr_reader :user, :query

    def initialize(user, account)
      @user = user
      @account = account
      @query = AccountRoleQuery.new(user, account)
    end

    def publish?
      user.admin? || query.has_at_least_role?(:publisher)
    end

    def configure_folder_on?
      publish?
    end

    def update_theming_on_entry_of?
      publish?
    end

    def manage?
      user.admin? || query.has_at_least_role?(:manager)
    end

    def read?
      manage?
    end

    def update?
      manage?
    end

    def update_feature_configuration_on?
      user.admin? ||
        (!permissions_config.only_admins_may_update_features &&
         manage?)
    end

    def add_member_to?
      manage?
    end

    def edit_role_on?
      manage?
    end

    def destroy_membership_on?
      manage?
    end

    def admin?
      user.admin?
    end

    def see_badge_belonging_to?
      (@account.entries & user.entries).any? ||
        query.has_at_least_role?(:previewer) ||
        user.admin?
    end

    def index?
      admin? || @user.memberships.on_accounts.as_manager.any?
    end

    private

    def allows?(roles)
      user.memberships.where(role: roles, entity: @account).any?
    end
  end
end
