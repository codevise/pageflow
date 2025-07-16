module Pageflow
  module Admin
    # @api private
    class EntryTabPolicy
      attr_reader :user, :tab, :query

      def initialize(user, tab)
        @user = user
        @tab = tab
        @query = EntryRoleQuery.new(user, tab.resource)
      end

      def see?
        if user.admin?
          true
        elsif tab.required_account_role
          query.has_at_least_account_role?(tab.required_account_role)
        elsif tab.required_role
          query.has_at_least_role?(tab.required_role)
        else
          !tab.admin_only?
        end
      end
    end
  end
end
