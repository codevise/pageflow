module Dom
  module Admin
    class SignInForm < Domino
      selector '#login'

      def submit_with(options)
        within(id) do
          fill_in 'user_email', with: options[:email]
          fill_in 'user_password', with: options[:password]

          find('[name="commit"]').click
        end
      end

      def forgot_password_link
        within(id) do
          find('a')
        end
      end
    end
  end
end
