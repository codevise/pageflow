module Pageflow
  module Admin
    module UsersHelper
      def collection_for_user_roles
        User.roles_accessible_by(current_ability).index_by { |role| t(role, :scope => 'pageflow.admin.users.roles') }
      end

      def delete_own_user_section
        user_deletion_permission = Pageflow.config.authorize_user_deletion.call(current_user)
        if user_deletion_permission == true
          render('pageflow/admin/users/may_delete')
        else
          render('pageflow/admin/users/cannot_delete', reason: user_deletion_permission)
        end
      end
    end
  end
end
