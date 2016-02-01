module Pageflow
  module Admin
    class UsersTab < ViewComponent
      def build(theming)
        account = theming.account
        embedded_index_table account.users.order(
            params[:order] && User.column_names.include?(params[:order].gsub('_asc', '').gsub('_desc', '')) ?
                params[:order].gsub('_asc', ' asc').gsub('_desc', ' desc') : 'last_name asc'),
                             blank_slate_text: I18n.t('pageflow.admin.entries.no_members') do
          table_for_collection :sortable => true, :class => 'users', :i18n => User do
            column :formal_name, :sortable => :last_name do |user|
              link_to user.formal_name, admin_user_path(user)
            end
          end
        end
      end
    end
  end
end
