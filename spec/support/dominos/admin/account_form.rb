module Dom
  module Admin
    class AccountForm < Domino
      selector 'form.account'

      def submit_with(options)
        within(node) do
          fill_in('account_name', :with => options[:name]) if options[:name]
          find('[name="commit"]').click
        end
      end
    end
  end
end
