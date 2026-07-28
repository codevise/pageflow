module Dom
  module Editor
    class ManageFilesPanel < Domino
      selector '.editor div.manage_files'

      def add_button
        node.find('.manage_files-add')
      end

      # The menu of the add button is rendered next to the menus of the
      # editor rather than inside the panel.
      def add_menu_item(name)
        Capybara.current_session.find(
          '#editor_menu_container .drop_down_button_item a',
          text: I18n.t("pageflow.editor.views.files_view.#{name}")
        )
      end

      def request_file_reuse
        add_button.hover
        add_menu_item(:reuse).click
      end
    end
  end
end
