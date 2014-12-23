module Pageflow
  module Admin
    module UsersHelper
      def collection_for_user_roles
        User.roles_accessible_by(current_ability).index_by { |role| t(role, :scope => 'pageflow.admin.users.roles') }
      end
    end
  end
end
