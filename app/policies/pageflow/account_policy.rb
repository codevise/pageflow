module Pageflow
  # @api private
  class AccountPolicy < ApplicationPolicy
    # @api private
    class Scope < Scope
      attr_reader :user, :scope, :query

      def initialize(user, scope)
        @user = user
        @scope = scope
        @query = AccountRoleQuery::Scope.new(user, scope)
      end

      def resolve
        if user.admin?
          scope.all
        else
          query.with_role_at_least(:member)
        end
      end

      def entry_creatable
        if user.admin?
          scope.all
        else
          query.with_role_at_least(:publisher)
        end
      end

      def entry_movable
        entry_creatable
      end

      def sites_accessible
        entry_creatable
      end

      def folder_addable
        entry_creatable
      end

      def member_addable
        if user.admin?
          scope.all
        else
          query.with_role_at_least(:manager)
        end
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

    def update_site_on_entry_of?
      publish?
    end

    def read?
      user.admin? ||
        (query.has_at_least_role?(:manager) &&
         Pageflow.config.allow_multiaccount_users)
    end

    def update?
      read?
    end

    def update_feature_configuration_on?
      user.admin? ||
        (!permissions_config.only_admins_may_update_features &&
         read?)
    end

    def add_member_to?
      Pageflow.config.allow_multiaccount_users &&
        (user.admin? ||
         query.has_at_least_role?(:manager))
    end

    def see_user_quota?
      user.admin? ||
        query.has_at_least_role?(:manager)
    end

    def see_entry_types?
      user.admin? ||
        query.has_at_least_role?(:publisher)
    end

    def edit_role_on?
      user.admin? || query.has_at_least_role?(:manager)
    end

    def destroy_membership_on?
      add_member_to?
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
      admin? ||
        (Pageflow.config.allow_multiaccount_users &&
         @user.memberships.on_accounts.as_manager.any?)
    end
  end
end
