module Dom
  module Admin
    class AccountForm < Domino
      selector 'form.pageflow_account'

      def submit_with(options)
        within(node) do
          fill_in('account_name',
                  with: options[:name]) if options[:name]

          fill_in('account_default_theming_attributes_cname',
                  with: options[:cname]) if options[:cname]

          if options[:default_author]
            fill_in('account_paged_entry_template_attributes_default_author',
                    with: options[:default_author])
          end

          if options[:default_publisher]
            fill_in('account_paged_entry_template_attributes_default_publisher',
                    with: options[:default_publisher])
          end

          if options[:default_keywords]
            fill_in('account_paged_entry_template_attributes_default_keywords',
                    with: options[:default_keywords])
          end

          select(options[:theme_name],
                 from: 'account_paged_entry_template_attributes_theme_name') if options[:theme_name]

          find('[name="commit"]').click
        end
      end
    end
  end
end
