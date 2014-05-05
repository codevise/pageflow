module Dom
  module Editor
    class ChapterProperties < Domino
      selector 'sidebar.editor .edit_chapter'

      def destroy_button
        node.find('.destroy')
      end
    end
  end
end
