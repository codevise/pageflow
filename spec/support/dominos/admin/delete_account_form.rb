module Dom
  module Admin
    class DeleteAccountForm < Domino
      selector 'form.delete_account'

      def submit_with(options)
        within(node) do
          fill_in 'user_current_password', with: options[:current_password]
          find('[name="commit"]').click
        end
      end
    end
  end
end
