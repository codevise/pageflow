module Pageflow
  class EntryPolicy
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
          scope
            .joins(memberships_above_role_for_entries(user, :member))
            .joins(memberships_above_role_for_account_of_entries(user, :member))
            .where(either_membership_is_present)
        end
      end

      def editor_or_above
        scope
          .joins(memberships_above_role_for_entries(user, :previewer))
          .joins(memberships_above_role_for_account_of_entries(user, :previewer))
          .where(either_membership_is_present)
      end

      def publisher_or_above
        scope
          .joins(memberships_above_role_for_entries(user, :editor))
          .joins(memberships_above_role_for_account_of_entries(user, :editor))
          .where(either_membership_is_present)
      end

      def member_addable
        publisher_or_above
      end

      def manager_or_above
        scope
          .joins(memberships_above_role_for_entries(user, :publisher))
          .joins(memberships_above_role_for_account_of_entries(user, :publisher))
          .where(either_membership_is_present)
      end

      private

      def sanitize_sql_array(array)
        ActiveRecord::Base.send(:sanitize_sql_array, array)
      end

      def memberships_above_role_for_entries(user, role)
        sanitize_sql_array(
          ['LEFT OUTER JOIN pageflow_memberships as pm_entry_pol_entries_role ON ' \
           'pm_entry_pol_entries_role.user_id = :user_id AND ' \
           'pm_entry_pol_entries_role.role IN (:roles) AND ' \
           'pm_entry_pol_entries_role.entity_id = pageflow_entries.id AND ' \
           'pm_entry_pol_entries_role.entity_type = "Pageflow::Entry"',
           user_id: user.id, roles: roles_above(role)])
      end

      def memberships_above_role_for_account_of_entries(user, role)
        sanitize_sql_array(
          ['LEFT OUTER JOIN pageflow_memberships as pm_entry_pol_accounts_role ON ' \
           'pm_entry_pol_accounts_role.user_id = :user_id AND ' \
           'pm_entry_pol_accounts_role.role IN (:roles) AND ' \
           'pm_entry_pol_accounts_role.entity_id = pageflow_entries.account_id ' \
           'AND pm_entry_pol_accounts_role.entity_type = "Pageflow::Account"',
           user_id: user.id, roles: roles_above(role)])
      end

      def roles_above(role)
        if role == :member
          %w(previewer editor publisher manager)
        elsif role == :previewer
          %w(editor publisher manager)
        elsif role == :editor
          %w(publisher manager)
        elsif role == :publisher
          %w(manager)
        end
      end

      def either_membership_is_present
        'pm_entry_pol_entries_role.entity_id IS NOT NULL OR ' \
        'pm_entry_pol_accounts_role.entity_id IS NOT NULL'
      end
    end

    def initialize(user, entry)
      @user = user
      @entry = entry
    end

    def preview?
      allows?(%w(previewer editor publisher manager))
    end

    def read?
      preview?
    end

    def use_files?
      preview?
    end

    def edit?
      allows?(%w(editor publisher manager))
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
      allows?(%w(publisher manager))
    end

    def create?
      publish?
    end

    def duplicate?
      publish?
    end

    def manage?
      @user.admin? ||
        allows?(%w(manager))
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
      account_allows?(%w(publisher manager))
    end

    def update_account_on?
      publish_on_account_of?
    end

    def update_theming_on?
      publish_on_account_of?
    end

    def manage_account_of?
      account_allows?(%w(manager))
    end

    def update_feature_configuration_on?
      manage_account_of?
    end

    def destroy?
      manage_account_of?
    end

    private

    def allows?(roles)
      user_memberships = @user.memberships.where(role: roles)

      user_memberships.where("(entity_id = :entry_id AND entity_type = 'Pageflow::Entry') OR " \
                             "(entity_id = :account_id AND entity_type = 'Pageflow::Account')",
                             entry_id: @entry.id, account_id: @entry.account.id).any?
    end

    def account_allows?(roles)
      @user.memberships.where(role: roles, entity: @entry.account).any?
    end
  end
end
