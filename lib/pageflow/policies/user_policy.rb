module Pageflow
  module Policies
    class UserPolicy
      def initialize(user, managed_user)
        @user = user
        @managed_user = managed_user
      end

      def manage_account_of?
        manager_accounts = Pageflow::Policies::AccountPolicy::Scope.new(@user,
                                                                        Account).member_addable
        managed_user_accounts = Pageflow::Policies::AccountPolicy::Scope.new(@managed_user,
                                                                             Account).resolve
        manager_accounts & managed_user_accounts
      end

      def read?
        manage_account_of?
      end
    end
  end
end
