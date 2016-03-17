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
          scope.joins(sanitize_sql_array([
            'LEFT OUTER JOIN pageflow_memberships ON ' \
            'pageflow_memberships.user_id = :user_id AND ' \
            'pageflow_memberships.entity_id = pageflow_entries.id AND ' \
            'pageflow_memberships.entity_type = "Pageflow::Entry"',
            user_id: user.id])).joins(sanitize_sql_array([
              'LEFT OUTER JOIN pageflow_memberships as pageflow_memberships_2 ON ' \
              'pageflow_memberships_2.user_id = :user_id AND ' \
              'pageflow_memberships_2.entity_id = pageflow_entries.account_id AND ' \
              'pageflow_memberships_2.entity_type = "Pageflow::Account"',
              user_id: user.id])).where(
                'pageflow_memberships.entity_id IS NOT NULL OR ' \
                'pageflow_memberships_2.entity_id IS NOT NULL')
        end

        private

        def sanitize_sql_array(array)
          ActiveRecord::Base.send(:sanitize_sql_array, array)
        end
      end

      def initialize(user, entry)
        @user = user
        @entry = entry
      end

      def read?
        preview?
      end

      def preview?
        allows?(%w(previewer editor publisher manager))
      end

      def edit?
        allows?(%w(editor publisher manager))
      end

      def publish?
        allows?(%w(publisher manager))
      end

      def configure?
        allows?(%w(manager))
      end

      private

      def allows?(roles)
        user_memberships = @user.memberships.where(role: roles)

        user_memberships.where("(entity_id = :entry_id AND entity_type = 'Pageflow::Entry') OR " \
                               "(entity_id = :account_id AND entity_type = 'Pageflow::Account')",
                               entry_id: @entry.id, account_id: @entry.account.id).any?
      end
    end
  end
end
