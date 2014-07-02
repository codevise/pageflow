module Dom
  module Admin
    class AccountForm < Domino
      selector 'form.pageflow_account'

      def submit_with(options)
        within(node) do
          fill_in('account_name', :with => options[:name]) if options[:name]
          fill_in('account_default_theming_attributes_cname', :with => options[:cname]) if options[:cname]
          select(options[:theme_name], :from => 'account_default_theming_attributes_theme_name') if options[:theme_name]

          find('[name="commit"]').click
        end
      end
    end
  end
end
