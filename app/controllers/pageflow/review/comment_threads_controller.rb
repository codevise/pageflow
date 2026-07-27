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

      def create
        entry = DraftEntry.find(params[:entry_id])
        authorize!(:read, entry.to_model)

        @comment_thread = entry.comment_threads.build(thread_params)
        @comment_thread.creator = current_user

        first_comment = @comment_thread.comments.build(first_comment_params)
        first_comment.creator = current_user

        @comment_thread.save!
        render :create, status: :created
      end

      def update
        entry = DraftEntry.find(params[:entry_id])
        authorize!(:read, entry.to_model)

        @comment_thread = entry.comment_threads.find(params[:id])

        if ActiveModel::Type::Boolean.new.cast(params[:comment_thread][:resolved])
          @comment_thread.resolve(current_user)
        else
          @comment_thread.unresolve
        end

        render :create
      end

      private

      def thread_params
        permitted = params.require(:comment_thread)
                          .permit(:subject_type, :subject_id, :section_perma_id)
        permitted[:subject_range] = params[:comment_thread][:subject_range]&.permit!
        permitted
      end

      def first_comment_params
        params.require(:comment_thread).require(:comment).permit(:body, :quote)
      end
    end
  end
end
