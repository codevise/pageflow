module Pageflow
  module Roles
    module_function

    def at_least(role_uncasted)
      role = role_uncasted.to_sym
      if role == :member
        %w(member previewer editor publisher manager)
      elsif role == :previewer
        %w(previewer editor publisher manager)
      elsif role == :editor
        %w(editor publisher manager)
      elsif role == :publisher
        %w(publisher manager)
      elsif role == :manager
        %w(manager)
      end
    end

    def high(user, entry)
      roles = [:none, :member, :previewer, :editor, :publisher, :manager]
      account_role = Membership.where(user: user, entity: entry.account).first.role || :none
      if user.entries.include?(entry)
        entry_role = Membership.where(user: user, entity: entry).first.role
      else
        entry_role = :none
      end

      if roles.find_index(account_role.to_sym) > roles.find_index(entry_role.to_sym)
        account_role.to_sym
      else
        entry_role.to_sym
      end
    end
  end
end
