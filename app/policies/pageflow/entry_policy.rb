module Pageflow
  # @api private
  class EntryPolicy < ApplicationPolicy
    # @api private
    class Scope < Scope
      attr_reader :user, :scope, :query

      def initialize(user, scope)
        @user = user
        @scope = scope
        @query = EntryRoleQuery::Scope.new(user, scope)
      end

      def resolve
        if user.admin?
          scope.all
        else
          query.with_role_at_least(:previewer)
        end
      end

      def editor_or_above
        query.with_role_at_least(:editor)
      end

      def publisher_or_above
        query.with_role_at_least(:publisher)
      end

      def member_addable
        publisher_or_above
      end

      def manager_or_above
        query.with_role_at_least(:manager)
      end
    end

    attr_reader :user, :query

    def initialize(user, entry)
      @user = user
      @entry = entry
      @query = EntryRoleQuery.new(user, entry)
    end

    def record
      @entry
    end

    def filter_by_type?
      user.admin?
    end

    def preview?
      query.has_at_least_role?(:previewer)
    end

    def read?
      preview?
    end

    def use_files?
      preview?
    end

    def edit?
      query.has_at_least_role?(:editor)
    end

    def confirm_encoding?
      edit?
    end

    def edit_outline?
      edit?
    end

    def index_widgets_for?
      edit?
    end

    def restore?
      edit?
    end

    def snapshot?
      edit?
    end

    def publish?
      query.has_at_least_role?(:publisher)
    end

    def create_any?
      AccountPolicy::Scope.new(@user, Account).entry_creatable.any?
    end

    def create?
      query.has_at_least_account_role?(:publisher)
    end

    def duplicate?
      query.has_at_least_role?(:publisher)
    end

    def manage_translations?
      query.has_at_least_account_role?(:publisher)
    end

    def manage?
      user.admin? ||
        query.has_at_least_role?(:manager)
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

    def publish_on_account_of?
      query.has_at_least_account_role?(:publisher)
    end

    def update_account_on?
      publish_on_account_of?
    end

    def update_site_on?
      user.admin? ||
        (!permissions_config.only_admins_may_update_site &&
         publish_on_account_of?)
    end

    def manage_account_of?
      query.has_at_least_account_role?(:manager)
    end

    def update_feature_configuration_on?
      user.admin? ||
        (!permissions_config.only_admins_may_update_features &&
         manage_account_of?)
    end

    def destroy?
      manage_account_of?
    end
  end
end
