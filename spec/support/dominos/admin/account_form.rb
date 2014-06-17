module Dom
  module Admin
    class AccountForm < Domino
      selector 'form.pageflow_account'

      def submit_with(options)
        within(node) do
          fill_in('account_name', :with => options[:name]) if options[:name]
          fill_in('account_default_theming_attributes_cname', :with => options[:cname]) if options[:cname]
          select(Pageflow::Theme.find(options[:theme_id]).css_dir, :from => 'account_default_theming_attributes_theme_id') if options[:theme_id]

          find('[name="commit"]').click
        end
      end
    end
  end
end
