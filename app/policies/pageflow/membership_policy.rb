module Pageflow
  # @api private
  class MembershipPolicy < ApplicationPolicy
    # @api private
    class Scope < Scope
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

      def permissions_appropriate
        sanitize_sql_array(['pageflow_memberships.entity_type = \'Pageflow::Account\' AND ' \
                            'pageflow_memberships.entity_id IN (:managed_account_ids) OR ' \
                            'pageflow_memberships.entity_type = \'Pageflow::Entry\' AND ' \
                            'pageflow_memberships.entity_id IN (:common_entry_ids) OR '\
                            'pageflow_memberships.user_id = :user_id',
                            {managed_account_ids:,
                             common_entry_ids:,
                             user_id: @user.id}])
      end

      def managed_account_ids
        user.memberships.on_accounts.where(role: 'manager').map(&:entity_id)
      end

      def common_entry_ids
        EntryPolicy::Scope.new(user, Entry).resolve.map(&:id)
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
      EntryPolicy.new(@user, @membership.entity).add_member_to? &&
        @membership.user.accounts.include?(@membership.entity.account)
    end

    def create_for_account?
      AccountPolicy.new(@user, @membership.entity).add_member_to?
    end

    def edit_role_on_entry?
      @user.admin? ||
        EntryPolicy.new(@user, @membership.entity).edit_role_on?
    end

    def edit_role_on_account?
      @user.admin? ||
        AccountPolicy.new(@user, @membership.entity).edit_role_on?
    end

    def destroy_for_entry?
      @user.admin? ||
        EntryPolicy.new(@user, @membership.entity).destroy_membership_on?
    end

    def destroy_for_account?
      AccountPolicy.new(@user, @membership.entity).destroy_membership_on?
    end
  end
end
