module Pageflow
  module Admin
    # @api private
    class AdminOnlyTabPolicy
      attr_reader :user, :tab

      def initialize(user, tab)
        @user = user
        @tab = tab
      end

      def see?
        !tab.admin_only? || user.admin?
      end
    end
  end
end
