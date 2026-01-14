module Pageflow
  module Dom
    module Editor
      class EditConfigurationView < Domino
        selector 'sidebar .edit_configuration_view'

        def actions_button
          node.find('.drop_down_button')
        end

        def select_action(label)
          actions_button.click
          Capybara.current_session.find('#editor_menu_container .drop_down_button_item', text: label).click
        end

        def back_button
          node.find('.back')
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
