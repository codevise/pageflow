module Dom
  module Admin
    class FilterForm < Domino
      selector 'form.filter_form'

      def fill_in_date_range(attribute, options)
        within(node) do
          if Pageflow::RailsVersion.experimental?
            fill_in("q[#{attribute}_gteq]", with: options[:from])
            fill_in("q[#{attribute}_lteq]", with: options[:to])
          else
            fill_in("q[#{attribute}_gteq_datetime]", with: options[:from])
            fill_in("q[#{attribute}_lteq_datetime]", with: options[:to])
          end
        end
      end

      def submit
        within(node) do
          find('[name="commit"]').click
        end
      end
    end
  end
end
