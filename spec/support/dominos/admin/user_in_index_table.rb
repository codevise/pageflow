module Dom
  module Admin
    class UserInIndexTable < Domino
      selector '.admin_users .index_table tbody tr'

      attribute :full_name, 'td.col-full_name'
      attribute :account_names, 'td.col-accounts'
    end
  end
end
