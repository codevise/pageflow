module Dom
  module Admin
    class NewPasswordForm < Domino
      selector '#login'

      def submit_with(options)
        within(id) do
          fill_in 'user_password', with: options[:password]
          fill_in 'user_password_confirmation', with: options[:password]

          find('[name="commit"]').click
        end
      end
    end
  end
end
