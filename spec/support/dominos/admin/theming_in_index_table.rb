module Dom
  module Admin
    class ThemingInIndexTable < Domino
      selector '.admin_themings.index .index_table tbody tr'

      attribute :account, 'td.account a'
      attribute :theme, 'td.theme'
    end
  end
end
