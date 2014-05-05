module Dom
  module Editor
    class ChapterItem < Domino
      selector '.editor ul.chapters > li'

      attribute :title

      def edit_link
        node.find('a.edit_chapter')
      end

      def page_list
        node.find('ul.pages')
      end

      def page_items
        within(node) do
          Dom::Editor::PageItem.all
        end
      end

      def has_page_item?
        node.has_selector?('ul.pages > li:not(.creating)')
      end

      def has_no_page_item?
        node.has_no_selector?('ul.pages > li:not(.creating)')
      end

      def add_page_button
        node.find('.add_page')
      end
    end
  end
end
