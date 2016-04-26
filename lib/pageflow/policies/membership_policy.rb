module Pageflow
  module Policies
    class MembershipPolicy
      class Scope
        attr_reader :user, :scope

        def initialize(user, scope)
          @user = user
          @scope = scope
        end

        def indexable
          if user.admin?
            scope.all
          else
            scope.where(permissions_appropriate).where(membership_is_present)
          end
        end

        private

        def sanitize_sql_array(array)
          ActiveRecord::Base.send(:sanitize_sql_array, array)
        end

        def permissions_appropriate
          sanitize_sql_array(['pageflow_memberships.entity_type = "Pageflow::Account" AND ' \
                              'pageflow_memberships.entity_id IN (:managed_account_ids) OR ' \
                              'pageflow_memberships.entity_type = "Pageflow::Entry" AND ' \
                              'pageflow_memberships.entity_id IN (:managed_entry_ids)',
                              managed_account_ids: managed_account_ids,
                              managed_entry_ids: managed_entry_ids])
        end

        def managed_account_ids
          user.memberships.on_accounts.where(role: 'manager').map(&:entity_id)
        end

        def managed_entry_ids
          user.memberships.on_entries.where(role: 'manager').map(&:entity_id)
        end

        def membership_is_present
          'pageflow_memberships.entity_id IS NOT NULL'
        end
      end

      def initialize(user, membership)
        @user = user
        @membership = membership
      end

      def create?
        if @membership.entity_type == 'Pageflow::Account'
          create_for_account?
        else
          create_for_entry?
        end
      end

      def edit_role?
        if @membership.entity_type == 'Pageflow::Account'
          edit_role_on_account?
        else
          edit_role_on_entry?
        end
      end

      def destroy?
        if @membership.entity_type == 'Pageflow::Account'
          destroy_for_account?
        else
          destroy_for_entry?
        end
      end

      private

      def create_for_entry?
        Pageflow::Policies::EntryPolicy.new(@user, @membership.entity).add_member_to? &&
          @membership.user.membership_accounts.include?(@membership.entity.account)
      end

      def create_for_account?
        Pageflow::Policies::AccountPolicy.new(@user, @membership.entity).add_member_to?
      end

      def edit_role_on_entry?
        @user.admin? ||
          Pageflow::Policies::EntryPolicy.new(@user, @membership.entity).edit_role_on?
      end

      def edit_role_on_account?
        @user.admin? ||
          Pageflow::Policies::AccountPolicy.new(@user, @membership.entity).edit_role_on?
      end

      def destroy_for_entry?
        @user.admin? ||
          Pageflow::Policies::EntryPolicy.new(@user, @membership.entity).destroy_membership_on?
      end

      def destroy_for_account?
        @user.admin? ||
          Pageflow::Policies::AccountPolicy.new(@user, @membership.entity).destroy_membership_on?
      end
    end
  end
end
