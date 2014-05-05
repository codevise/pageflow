module Dom
  module Admin
    class Membership < Domino
      selector '.memberships tbody tr'

      attribute :entry_title, 'td.entry'
      attribute :user_full_name, 'td.name'

    end
  end
end
