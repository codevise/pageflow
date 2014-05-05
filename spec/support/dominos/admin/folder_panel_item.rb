module Dom
  module Admin
    class FolderPanelItem < Domino
      selector '#folders_sidebar_section ul.folders li'

      attribute :name, '.name'

      def link
        within(node) do
          find('a.name')
        end
      end

      def edit_link
        within(node) do
          find('a.edit_folder')
        end
      end

      def delete_link
        within(node) do
          find('a.delete')
        end
      end
    end
  end
end
