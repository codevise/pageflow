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

      def update
        entry = DraftEntry.find(params[:entry_id])
        authorize!(:read, entry.to_model)

        @comment = find_comment(entry)

        return head(:forbidden) unless @comment.creator == current_user

        @comment.update!(update_params.merge(edited_at: Time.current))

        render :create
      end

      private

      def find_comment(entry)
        entry.comment_threads
             .find(params[:comment_thread_id])
             .comments
             .find(params[:id])
      end

      def comment_params
        params.require(:comment).permit(:body, :quote)
      end

      # The quote records the wording the comment referred to when it was
      # written. Editing must not make it describe some later version.
      def update_params
        params.require(:comment).permit(:body)
      end
    end
  end
end
