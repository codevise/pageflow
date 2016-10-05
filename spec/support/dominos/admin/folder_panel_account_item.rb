module Dom
  module Admin
    class FolderPanelAccountItem < Domino
      selector '#folders_sidebar_section ul.accounts > li'

      attribute :account_name
    end
  end
end
