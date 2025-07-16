module Dom
  module Admin
    class UserForm < Domino
      selector 'form.user'

      def submit_with(options)
        within(node) do
          fill_in('user_email', with: options[:email]) if options[:email]
          fill_in('user_first_name', with: options[:first_name]) if options[:first_name]
          fill_in('user_last_name', with: options[:last_name]) if options[:last_name]

          if options[:account_id]
            select(Pageflow::Account.find(options[:account_id]).name,
                   from: 'user_initial_account')
          end

          if has_selector?('#user_admin')
            if options[:admin]
              check 'user_admin'
            else
              uncheck 'user_admin'
            end
          end

          find('[name="commit"]').click
        end
      end
    end
  end
end
