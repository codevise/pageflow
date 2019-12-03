module Pageflow
  module Dom
    module Editor
      class FileImportChooser < Domino
        selector '.dialog_container > .choose_importer'

        def cancel_button
          node.find('button.close')
        end

        def importers_list
          node.find('ul.importers_panel')
        end

        def select_importer(importer_key)
          importers_list.find("li > .importer[data-key='#{importer_key}']").click
        end

        def has_importer?(importer_key)
          importers_list.has_selector?("li > .importer[data-key='#{importer_key}']")
        end
      end
    end
  end
end
