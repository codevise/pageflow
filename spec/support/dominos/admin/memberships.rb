module Dom
  module Admin
    class Membership < Domino
      selector '.memberships tbody tr'

      attribute :entry_title, 'td.col-entry'
      attribute :user_full_name, 'td.name'
    end
  end
end
