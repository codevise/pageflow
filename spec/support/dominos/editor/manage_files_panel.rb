module Dom
  module Editor
    class ManageFilesPanel < Domino
      selector '.editor div.manage_files'

      def add_button
        node.find('.select_button button')
      end

      def reuse_file_menu_item
        node.find('.select_button li a[data-index="1"]')
      end

      def request_file_reuse
        add_button.click
        reuse_file_menu_item.click
      end
    end
  end
end
