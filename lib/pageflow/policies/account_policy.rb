module Pageflow
  module Policies
    class AccountPolicy
      class Scope
        attr_reader :user, :scope

        def initialize(user, scope)
          @user = user
          @scope = scope
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

        private

        def sanitize_sql_array(array)
          ActiveRecord::Base.send(:sanitize_sql_array, array)
        end

        def publisher_memberships_for_account(user)
          sanitize_sql_array(['LEFT OUTER JOIN pageflow_memberships ON ' \
                              'pageflow_memberships.user_id = :user_id AND ' \
                              'pageflow_memberships.entity_id = pageflow_accounts.id AND ' \
                              'pageflow_memberships.entity_type = "Pageflow::Account" AND ' \
                              'pageflow_memberships.role IN ("publisher", "manager")',
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
        allows?(%w(publisher manager))
      end

      def configure_folder_on?
        publish?
      end

      def update_theming_on_entry_of?
        publish?
      end

      def manage?
        allows?(%w(manager))
      end

      def edit_role_on?
        manage?
      end

      def destroy_membership_on?
        manage?
      end

      private

      def allows?(roles)
        @user.memberships.where(role: roles, entity: @account).any?
      end
    end
  end
end
