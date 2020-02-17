module Pageflow
  module Dom
    module Editor
      class EditConfigurationView < Domino
        selector 'sidebar .edit_configuration_view'

        def destroy_button
          node.find('.destroy')
        end

        def input_value(label_text)
          node.find_field(label_text).value
        end

        def change_input(label_text, value)
          field = node.find_field(label_text)
          field.fill_in(with: value)
          field.native.send_keys(:tab)
        end
      end
    end
  end
end
