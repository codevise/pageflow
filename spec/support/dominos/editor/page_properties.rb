module Dom
  module Editor
    class PageProperties < Domino
      selector '#sidebar.editor .edit_page'

      def destroy_button
        node.find('.destroy')
      end
    end
  end
end
