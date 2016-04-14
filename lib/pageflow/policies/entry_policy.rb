module Pageflow
  module Policies
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
              .joins(memberships_for_entries(user))
              .joins(memberships_for_account_of_entries(user))
              .where(either_membership_is_present)
          end
        end

        def editor_or_above
          scope
            .joins(above_editor_memberships_for_entries(user))
            .joins(above_editor_memberships_for_account_of_entries(user))
            .where(either_membership_is_present)
        end

        private

        def sanitize_sql_array(array)
          ActiveRecord::Base.send(:sanitize_sql_array, array)
        end

        def memberships_for_entries(user)
          sanitize_sql_array(['LEFT OUTER JOIN pageflow_memberships ON ' \
                              'pageflow_memberships.user_id = :user_id AND ' \
                              'pageflow_memberships.entity_id = pageflow_entries.id AND ' \
                              'pageflow_memberships.entity_type = "Pageflow::Entry"',
                              user_id: user.id])
        end

        def memberships_for_account_of_entries(user)
          sanitize_sql_array(['LEFT OUTER JOIN pageflow_memberships as pageflow_memberships_2 ON ' \
                              'pageflow_memberships_2.user_id = :user_id AND ' \
                              'pageflow_memberships_2.entity_id = pageflow_entries.account_id ' \
                              'AND pageflow_memberships_2.entity_type = "Pageflow::Account"',
                              user_id: user.id])
        end

        def above_editor_memberships_for_entries(user)
          sanitize_sql_array(['LEFT OUTER JOIN pageflow_memberships ON ' \
                              'pageflow_memberships.user_id = :user_id AND ' \
                              'pageflow_memberships.role IN ("editor", "publisher", "manager") AND ' \
                              'pageflow_memberships.entity_id = pageflow_entries.id AND ' \
                              'pageflow_memberships.entity_type = "Pageflow::Entry"',
                              user_id: user.id])
        end

        def above_editor_memberships_for_account_of_entries(user)
          sanitize_sql_array(['LEFT OUTER JOIN pageflow_memberships as pageflow_memberships_2 ON ' \
                              'pageflow_memberships_2.user_id = :user_id AND ' \
                              'pageflow_memberships_2.role IN ("editor", "publisher", "manager") AND ' \
                              'pageflow_memberships_2.entity_id = pageflow_entries.account_id ' \
                              'AND pageflow_memberships_2.entity_type = "Pageflow::Account"',
                              user_id: user.id])
        end

        def either_membership_is_present
          'pageflow_memberships.entity_id IS NOT NULL OR ' \
          'pageflow_memberships_2.entity_id IS NOT NULL'
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

      def index_widgets_for?
        edit?
      end

      def edit_outline?
        edit?
      end

      def restore?
        edit?
      end

      def snapshot?
        edit?
      end

      def confirm_encoding?
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
end
