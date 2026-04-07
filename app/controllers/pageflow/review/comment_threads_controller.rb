module Pageflow
  module Review
    # @api private
    class CommentThreadsController < Pageflow::ApplicationController
      respond_to :json
      before_action :authenticate_user!

      def index
        entry = DraftEntry.find(params[:entry_id])
        authorize!(:read, entry.to_model)

        @comment_threads = entry.comment_threads.includes(comments: :creator)
      end
    end
  end
end
