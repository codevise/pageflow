module Dom
  module Admin
    class UserForm < Domino
      selector 'form.user'

      def submit_with(options)
        within(node) do
          fill_in('user_email', :with => options[:email]) if options[:email]
          fill_in('user_first_name', :with => options[:first_name]) if options[:first_name]
          fill_in('user_last_name', :with => options[:last_name]) if options[:last_name]

          select(Pageflow::Account.find(options[:account_id]).name, :from => 'user_account_id') if options[:account_id]

          if options[:admin]
            select(I18n.t('pageflow.admin.users.roles.admin'), :from => 'user_role')
          elsif options[:account_manager]
            select(I18n.t('pageflow.admin.users.roles.account_manager'), :from => 'user_role')
          else
            select(I18n.t('pageflow.admin.users.roles.editor'), :from => 'user_role')
          end

          find('[name="commit"]').click
        end
      end
    end
  end
end
