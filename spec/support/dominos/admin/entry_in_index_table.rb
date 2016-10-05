module Dom
  module Admin
    class EntryInIndexTable < Domino
      selector '.admin_entries.index .index_table tbody tr'

      attribute :title, 'td.col-title'
      attribute :account_name, 'td.col-account'

      def view_entry_link
        within(node) do
          find('a.view_link')
        end
      end

      def edit_entry_link
        within(node) do
          find('a.edit_link')
        end
      end

      def delete_entry_link
        within(node) do
          find('a.delete_link')
        end
      end
    end
  end
end
