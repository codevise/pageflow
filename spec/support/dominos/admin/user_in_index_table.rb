module Dom
  module Admin
    class UserInIndexTable < Domino
      selector '.admin_users .index_table tbody tr'

      attribute :full_name, 'td.full_name'
      attribute :account_name, 'td.account a'
    end
  end
end
