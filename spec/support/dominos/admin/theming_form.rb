module Dom
  module Admin
    class ThemingForm < Domino
      selector 'form.pageflow_theming'

      def imprint_label_value
        value_of('theming_imprint_link_label')
      end

      def value_of(name)
        within(node) do
          find("##{name}").value
        end
      end

      def submit_with(options)
        within(node) do
          fill_in('theming_account_attributes_cname', :with => options[:cname]) if options[:cname]
          fill_in('theming_copyright_link_label', :with => options[:copyright_label]) if options[:copyright_label]
          fill_in('theming_copyright_link_url', :with => options[:copyright_url]) if options[:copyright_url]
          fill_in('theming_imprint_link_label', :with => options[:imprint_label]) if options[:imprint_label]
          fill_in('theming_imprint_link_url', :with => options[:imprint_url]) if options[:imprint_url]
          select(Pageflow::Theme.find(options[:theme_id]).name, :from => 'theming_theme_id') if options[:theme_id]
          find('[name="commit"]').click
        end
      end
    end
  end
end
