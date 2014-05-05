module Dom
  module Admin
    class RevisionForm < Domino
      selector 'form.revision'

      def submit_with(options)
        within(node) do
          fill_in('revision_published_until', :with => options[:published_until]) if options[:published_until]
          find('[name="commit"]').click
        end
      end
    end
  end
end
