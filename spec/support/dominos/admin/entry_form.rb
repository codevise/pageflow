module Dom
  module Admin
    class EntryForm < Domino
      selector '.admin_entries'

      def submit_with(options)
        within(node) do
          fill_in('entry_title', with: options[:title]) if options[:title]
          if options[:account_id]
            select(Pageflow::Account.find(options[:account_id]).name,
                   from: 'entry_account_id')
          end
          if options[:folder_id]
            select(Pageflow::Folder.find(options[:folder_id]).name,
                   from: 'entry_folder_id')
          end
          find('[name="commit"]').click
        end
      end

      def select_account(id)
        within(node) do
          find('#select2-entry_account_id-container').click
          find('.select2-results__option', text: Pageflow::Account.find(id).name).click
        end
      end

      def has_entry_type_option?(type_name)
        node.has_selector?("#entry_type_name option[value='#{type_name}']") &&
          !node.has_selector?(
            "#entry_type_name option[value='#{type_name}'][style='display: none;']"
          )
      end
    end
  end
end
