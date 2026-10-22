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

        if restored.is_a?(Chapter)
          render partial: 'pageflow_scrolled/editor/chapters/chapter_with_sections',
                 locals: {chapter: restored}
        else
          render partial: 'pageflow_scrolled/editor/sections/section_with_content_elements',
                 locals: {section: restored}
        end
      rescue ActiveRecord::RecordNotFound
        head :not_found
      rescue Trash::DestinationMissing
        head :unprocessable_entity
      end
    end
  end
end
