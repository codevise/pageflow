module Dom
  module Editor
    class FilesExplorer < Domino
      selector 'div.files_explorer'

      def ok_button
        node.find('button.ok')
      end

      def find_file_gallery_item(file)
        node.find("ul.files_gallery li[data-id='#{file.id}']")
      end

      def select_file(_entry, file)
        find_file_gallery_item(file).click
        ok_button.click
      end
    end
  end
end
