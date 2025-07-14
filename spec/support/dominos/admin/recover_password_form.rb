module Dom
  module Admin
    class RecoverPasswordForm < Domino
      selector '#login'

      def submit_with(options)
        fill_in 'user_email', with: options[:email]
        find('[name="commit"]').click
      end
    end
  end
end
