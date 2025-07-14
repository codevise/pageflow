module Pageflow
  module Roles
    module_function

    def at_least(role_uncasted)
      role = role_uncasted.to_sym
      if role == :member
        %w[member previewer editor publisher manager]
      elsif role == :previewer
        %w[previewer editor publisher manager]
      elsif role == :editor
        %w[editor publisher manager]
      elsif role == :publisher
        %w[publisher manager]
      elsif role == :manager
        %w[manager]
      end
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
