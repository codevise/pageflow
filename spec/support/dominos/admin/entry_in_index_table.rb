module Dom
  module Admin
    class EntryInIndexTable < Domino
      selector '.admin_entries.index .index_table tbody tr'

      # Scoped to the link since the title cell also carries the comment
      # indicator.
      attribute :title, 'td.col-title a'
      attribute :account_name, 'td.col-account'

      def comments_indicator
        node.first('.entry_comments_indicator', minimum: 0)
      end
    end
  end
end
