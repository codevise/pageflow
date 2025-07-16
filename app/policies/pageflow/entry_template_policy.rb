module Pageflow
  # @api private
  class EntryTemplatePolicy < ApplicationPolicy
    def initialize(user, entry_template)
      @user = user
      @entry_template = entry_template
    end

    def create?
      update?
    end

    def update?
      allows?(%w[publisher manager])
    end

    private

    def allows?(roles)
      @user.memberships.where(role: roles, entity: @entry_template.site.account).any?
    end
  end
end
