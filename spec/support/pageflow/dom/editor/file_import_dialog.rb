module Pageflow
  module Dom
    module Editor
      class FileImportDialog < Domino
        selector '.dialog_container > .files_importer'

        def cancel_button
          node.find('button.close')
        end

        def import_button
          node.find('button.import')
        end

        def file_section
          node.find('.filesection')
        end

        def status
          node.find('.status')
        end
      end
    end
  end
end
