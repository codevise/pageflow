module Dom
  module Admin
    class FolderPanel < Domino
      selector '#folders_sidebar_section'

      def add_folder_link
        within(node) do
          find('a.new')
        end
      end
    end
  end
end
