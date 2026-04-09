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

        @comment_thread.comments.build(
          body: params[:comment_thread][:comment][:body],
          creator: current_user
        )

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
        params.require(:comment_thread).permit(:subject_type, :subject_id)
      end
    end
  end
end
