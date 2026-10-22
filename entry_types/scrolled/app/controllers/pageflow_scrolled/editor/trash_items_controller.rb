module PageflowScrolled
  module Editor
    # @api private
    class TrashItemsController < ActionController::Base
      include Pageflow::EditorController

      def index
        @items = Trash.new(@entry.draft).items
      end

      def restore
        restored = Trash.new(@entry.draft).find_item(params[:id]).restore

        case restored
        when Chapter
          render partial: 'pageflow_scrolled/editor/chapters/chapter_with_sections',
                 locals: {chapter: restored}
        when Section
          render partial: 'pageflow_scrolled/editor/sections/section_with_content_elements',
                 locals: {section: restored}
        else
          render partial: 'pageflow_scrolled/editor/trash_items/content_elements',
                 locals: {content_elements: restored}
        end
      rescue ActiveRecord::RecordNotFound
        head :not_found
      rescue Trash::DestinationMissing
        head :unprocessable_entity
      end

      def destroy
        Trash.new(@entry.draft).find_item(params[:id]).destroy

        head :no_content
      rescue ActiveRecord::RecordNotFound
        head :not_found
      end

      def empty
        Trash.new(@entry.draft).empty

        head :no_content
      end
    end
  end
end
