module Dom
  module Admin
    class SiteForm < Domino
      selector 'form.pageflow_site'

      def submit_with(options)
        within(node) do
          fill_in('site_cname', with: options[:cname]) if options[:cname]

          find('[name="commit"]').click
        end
      end
    end
  end
end
