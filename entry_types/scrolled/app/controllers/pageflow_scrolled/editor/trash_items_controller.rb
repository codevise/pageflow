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

        render partial: 'pageflow_scrolled/editor/sections/section_with_content_elements',
               locals: {section: restored}
      rescue ActiveRecord::RecordNotFound
        head :not_found
      rescue Trash::DestinationMissing
        head :unprocessable_entity
      end
    end
  end
end
