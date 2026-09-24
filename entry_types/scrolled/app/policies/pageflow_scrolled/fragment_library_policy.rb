module PageflowScrolled
  # @api private
  class FragmentLibraryPolicy
    # @api private
    class Scope
      def initialize(user, scope)
        @user = user
        @scope = scope
      end

      def read
        return @scope if @user.admin?

        @scope.merge(
          Pageflow::EntryRoleQuery::Scope.new(@user, Pageflow::Entry).with_role_at_least(:previewer)
        )
      end
    end

    def initialize(user, library)
      @user = user
      @library = library
    end

    def read?
      @user.admin? || entry_role_query.has_at_least_role?(:previewer)
    end

    def update?
      return true if @user.admin?

      if @library.persisted?
        entry_role_query.has_at_least_role?(:editor)
      else
        Pageflow::AccountRoleQuery.new(@user, @library.account).has_at_least_role?(:editor)
      end
    end

    private

    def entry_role_query
      Pageflow::EntryRoleQuery.new(@user, @library.entry)
    end
  end
end
