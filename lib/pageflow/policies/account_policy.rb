module Pageflow
  module Policies
    class AccountPolicy
      def initialize(user, account)
        @user = user
        @account = account
      end

      def publish?
        allows?(%w(publisher manager))
      end

      private

      def allows?(roles)
        @user.memberships.where(role: roles, entity: @account).any?
      end
    end
  end
end
