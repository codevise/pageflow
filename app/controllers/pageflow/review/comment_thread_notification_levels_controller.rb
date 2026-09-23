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

        notifications = notifications(entry.to_model)

        # Rendered without a jbuilder, so the key is camelized here the
        # way key_format! does it for the rest of the review API.
        render json: {
          level: notifications.level_for_thread(comment_thread),
          commentNotificationsMuted: muted?(notifications)
        }
      end

      private

      def write(entry, comment_thread)
        ActiveRecord::Base.transaction do
          stored = CommentThreadNotificationOverride.set(
            entry:,
            user: current_user,
            comment_thread_perma_id: comment_thread.perma_id,
            level: params[:level]
          )

          raise ActiveRecord::Rollback unless stored

          unmute(entry)
          true
        end
      end

      # A muted entry swallows the thread's level, so the entry has to
      # come down to watched threads before the watch has any say.
      def unmute(entry)
        return unless params[:level] == CommentNotificationLevel::ALL_ACTIVITY
        return unless muted?(notifications(entry))

        EntryCommentNotificationOverride.set(entry:,
                                             user: current_user,
                                             level: CommentNotificationLevel::WATCHED_THREADS)
      end

      # Guards against override records piling up for comment threads
      # that do not exist in the entry.
      def known_comment_thread(entry)
        entry.comment_threads.find_by(perma_id: params[:id])
      end

      def muted?(notifications)
        notifications.level == CommentNotificationLevel::MUTED
      end

      def notifications(entry)
        CommentNotifications.for_entry(entry, user: current_user)
      end
    end
  end
end
