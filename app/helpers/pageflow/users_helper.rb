module Pageflow
  module UsersHelper
    def collection_for_user_roles
      User.roles_accessible_by(current_ability).index_by { |role| t(role, :scope => 'admin.users.roles') }
    end

    def user_collection_for_parent(parent)
      if parent.is_a?(Entry)
        parent.account.users - parent.users
      else
        parent.account.users
      end
    end
  end
end
