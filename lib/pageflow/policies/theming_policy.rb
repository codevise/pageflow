module Pageflow
  module Policies
    class ThemingPolicy
      class Scope
        attr_reader :user, :scope

        def initialize(user, scope)
          @user = user
          @scope = scope
        end

        def themings_allowed_for(accounts)
          if user.admin?
            scope.all
          else
            accounts_id = accounts.try(:id) || accounts.map { :id }
            scope.where(account_id: accounts_id)
          end
        end
      end

      def initialize(user, theming)
        @user = user
        @theming = theming
      end

      def edit?
        allows?(%w(publisher manager))
      end

      def index_widgets_for?
        @user.admin?
      end

      private

      def allows?(roles)
        @user.memberships.where(role: roles, entity: @theming.account).any?
      end
    end
  end
end
