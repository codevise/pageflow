module Pageflow
  module Policies
    class EntryPolicy
      def initialize(user, entry)
        @user = user
        @entry = entry
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
