module Pageflow
  module Dom
    module Editor
      class Sidebar < Domino
        selector 'sidebar.editor'

        def has_chapter_item?
          node.has_selector?('ul.chapters > li:not(.creating)')
        end

        def has_no_chapter_item?
          node.has_no_selector?('ul.chapters > li')
        end

        def add_chapter_button
          node.find('.add_chapter')
        end

        def publish_button
          node.find('.publish')
        end

        def manage_files_menu_item
          node.find('.menu .manage_files')
        end
      end
    end
  end
end
