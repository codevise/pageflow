module Pageflow
  module Roles # rubocop:todo Style/Documentation
    module_function

    def at_least(role_uncasted)
      role = role_uncasted.to_sym
      {
        member: %w[member previewer editor publisher manager],
        previewer: %w[previewer editor publisher manager],
        editor: %w[editor publisher manager],
        publisher: %w[publisher manager],
        manager: %w[manager]
      }[role]
    end

    def high(user, entry)
      roles = [:none, :member, :previewer, :editor, :publisher, :manager]

      account_membership = Membership.where(user:, entity: entry.account).first
      account_role = account_membership ? account_membership.role : :none

      entry_role = if user.entries.include?(entry)
                     Membership.where(user:, entity: entry).first.role
                   else
                     :none
                   end

      if roles.find_index(account_role.to_sym) > roles.find_index(entry_role.to_sym)
        account_role.to_sym
      else
        entry_role.to_sym
      end
    end
  end
end
