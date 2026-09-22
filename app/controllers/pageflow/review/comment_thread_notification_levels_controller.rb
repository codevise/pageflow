module Pageflow
  module Review
    # @api private
    class CommentThreadNotificationLevelsController < Pageflow::ApplicationController
      respond_to :json
      before_action :authenticate_user!

      def update
        entry = DraftEntry.find(params[:entry_id])
        authorize!(:read, entry.to_model)

        comment_thread = known_comment_thread(entry)
        return head(:not_found) unless comment_thread
        return head(:unprocessable_entity) unless write(entry.to_model, comment_thread)

        render json: {level: notifications(entry.to_model).level_for_thread(comment_thread)}
      end

      private

      def write(entry, comment_thread)
        CommentThreadNotificationOverride.set(entry:,
                                              user: current_user,
                                              comment_thread_perma_id: comment_thread.perma_id,
                                              level: params[:level])
      end

      # Guards against override records piling up for comment threads
      # that do not exist in the entry.
      def known_comment_thread(entry)
        entry.comment_threads.find_by(perma_id: params[:id])
      end

      def notifications(entry)
        CommentNotifications.for_entry(entry, user: current_user)
      end
    end
  end
end
