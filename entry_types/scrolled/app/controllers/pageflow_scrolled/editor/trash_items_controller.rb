module PageflowScrolled
  module Editor
    # @api private
    class TrashItemsController < ActionController::Base
      include Pageflow::EditorController

      def index
        @items = Trash.new(@entry.draft).items
      end
    end
  end
end
