module Dom
  module Editor
    class EntryOutline < Domino
      selector 'sidebar nav[class^=EntryOutlineView]'

      def add_chapter_button
        node.find('[class^=EntryOutlineView-module_addChapter]')
      end

      def chapter_items
        within(node) do
          ChapterItem.all
        end
      end

      class ChapterItem < Domino
        selector '[class^=ChapterItemView-module_root]' \
          ':not([class*=creating]):not([class*=destroying])'

        def section_items
          within(node) do
            SectionItem.all
          end
        end

        def edit_link
          node.find('[class^=ChapterItemView-module_link]')
        end

        def add_section_button
          node.find('[class^=ChapterItemView-module_addSection]')
        end
      end

      class SectionItem < Domino
        selector '[class^=SectionItemView-module_root]' \
          ':not([class*=creating]):not([class*=destroying])'

        def thumbnail
          node.find('[class^=SectionItemView-module_clickMask]')
        end
      end
    end
  end
end
