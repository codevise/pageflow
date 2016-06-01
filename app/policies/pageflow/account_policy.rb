module Pageflow
  class AccountPolicy
    class Scope
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

      def member_addable
        if user.admin?
          scope.all
        else
          scope.joins(manager_memberships_for_account(user)).where(membership_is_present)
        end
      end

      private

      def sanitize_sql_array(array)
        ActiveRecord::Base.send(:sanitize_sql_array, array)
      end

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

    def initialize(user, account)
      @user = user
      @account = account
    end

    def publish?
      @user.admin? ||
        allows?(%w(publisher manager))
    end

    def configure_folder_on?
      publish?
    end

    def update_theming_on_entry_of?
      publish?
    end

    def manage?
      @user.admin? ||
        allows?(%w(manager))
    end

    def read?
      manage?
    end

    def update?
      manage?
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
      @user.admin?
    end

    def index?
      admin? || @user.memberships.on_accounts.as_manager.any?
    end

    def see_all_instances_of_class_of?
      admin? || manages_all_accounts?
    end

    private

    def allows?(roles)
      @user.memberships.where(role: roles, entity: @account).any?
    end

    def manages_all_accounts?
      user_accounts = @user.accounts.load
      Account.all.each do |account|
        return false unless user_accounts.include?(account)
      end
      true
    end
  end
end
