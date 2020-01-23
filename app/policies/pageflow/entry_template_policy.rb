module Pageflow
  class EntryTemplatePolicy < ApplicationPolicy
    def initialize(user, entry_template)
      @user = user
      @entry_template = entry_template
    end

    def edit?
      allows?(%w(publisher manager))
    end

    private

    def allows?(roles)
      @user.memberships.where(role: roles, entity: @entry_template.account).any?
    end
  end
end
