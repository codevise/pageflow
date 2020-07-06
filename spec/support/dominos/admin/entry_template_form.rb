module Dom
  module Admin
    class EntryTemplateForm < Domino
      selector 'form.pageflow_entry_template'

      def submit_with(options)
        within(node) do
          if options[:default_author]
            fill_in('entry_template_default_author',
                    with: options[:default_author])
          end

          if options[:default_publisher]
            fill_in('entry_template_default_publisher',
                    with: options[:default_publisher])
          end

          if options[:default_keywords]
            fill_in('entry_template_default_keywords',
                    with: options[:default_keywords])
          end

          if options[:theme_name]
            select(options[:theme_name],
                   from: 'entry_template_theme_name')
          end

          find('[name="commit"]').click
        end
      end
    end
  end
end
