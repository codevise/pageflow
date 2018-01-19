module Dom
  module Admin
    class EntryInIndexTable < Domino
      selector '.admin_entries.index .index_table tbody tr'

      attribute :title, 'td.col-title'
      attribute :account_name, 'td.col-account'
    end
  end
end
