module Pageflow
  module Dom
    module Editor
      class EditConfigurationView < Domino
        selector 'sidebar .edit_configuration_view'

        def destroy_button
          node.find('.destroy')
        end
      end
    end
  end
end
