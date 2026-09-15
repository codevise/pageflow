module Pageflow
  module Review
    # @api private
    class CommentThreadsController < Pageflow::ApplicationController
      respond_to :json
      before_action :authenticate_user!

      def index
        entry = DraftEntry.find(params[:entry_id])
        authorize!(:read, entry.to_model)

        @comment_threads = entry.comment_threads.includes(:resolver, comments: :creator)
        @read_at_by_perma_id =
          CommentThreadRead.read_at_by_perma_id(entry: entry.to_model, user: current_user)
        @notifications = notifications(entry.to_model)
      end

      def create
        entry = DraftEntry.find(params[:entry_id])
        authorize!(:read, entry.to_model)

        @comment_thread = build_thread(entry)
        @comment_thread.save!
        @notification_level = notifications(entry.to_model).level_for_thread(@comment_thread)

        render :create, status: :created
      end

      def update
        entry = DraftEntry.find(params[:entry_id])
        authorize!(:read, entry.to_model)

        @comment_thread = entry.comment_threads.find(params[:id])
        toggle_resolved(@comment_thread)
        @notification_level = notifications(entry.to_model).level_for_thread(@comment_thread)

        render :create
      end

      private

      def toggle_resolved(comment_thread)
        if ActiveModel::Type::Boolean.new.cast(params[:comment_thread][:resolved])
          comment_thread.resolve(current_user)
        else
          comment_thread.unresolve
        end
      end

      def build_thread(entry)
        thread = entry.comment_threads.build(thread_params)
        thread.creator = current_user

        first_comment = thread.comments.build(first_comment_params)
        first_comment.creator = current_user

        thread
      end

      def notifications(entry)
        CommentNotifications.for_entry(entry, user: current_user)
      end

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
