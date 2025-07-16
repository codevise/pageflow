module Dom
  module Admin
    class ProfileForm < Domino
      selector 'form.profile'

      def first_name
        find('#user_first_name').value
      end

      def last_name
        find('#user_last_name').value
      end

      def submit_with(options)
        within(node) do
          fill_in('user_first_name', with: options[:first_name]) if options[:first_name]
          fill_in('user_last_name', with: options[:last_name]) if options[:last_name]
          fill_in('user_current_password', with: options[:current_password])
          fill_in('user_password', with: options[:password])
          fill_in('user_password_confirmation', with: options[:password_confirmation])

          find('[name="commit"]').click
        end
      end

      def delete_account_link
        within(id) do
          find('a.delete_account')
        end
      end
    end
  end
end
