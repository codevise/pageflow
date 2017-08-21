module Pageflow
  # Query users for their role on accounts based on role
  class AccountRoleQuery
    # Create query that can be used for role comparisons
    #
    # @param [User] user
    #   Required. Membership user to check.
    # @param [Pageflow::Account] account
    #   Required. Membership entity to check.
    def initialize(user, account)
      @user = user
      @account = account
    end

    # Return true if there is a membership with at least role for
    # user/account
    #
    # @param [String] role
    #   Required. Minimum role that we compare against.
    # @return [Boolean]
    def has_at_least_role?(role)
      @user
        .memberships
        .where(role: Roles.at_least(role))
        .where('(entity_id = :account_id AND '\
               "entity_type = 'Pageflow::Account')",
               account_id: @account.id)
        .any?
    end
  end
end
