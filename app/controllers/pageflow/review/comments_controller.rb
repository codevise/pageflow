module Pageflow
  module Review
    # @api private
    class CommentsController < Pageflow::ApplicationController
      respond_to :json
      before_action :authenticate_user!

      def create
        entry = DraftEntry.find(params[:entry_id])
        authorize!(:read, entry.to_model)

        thread = entry.comment_threads.find(params[:comment_thread_id])
        @comment = thread.comments.build(comment_params)
        @comment.creator = current_user
        @comment.save!

        render :create, status: :created
      end

      private

      def comment_params
        params.require(:comment).permit(:body)
      end
    end
  end
end
