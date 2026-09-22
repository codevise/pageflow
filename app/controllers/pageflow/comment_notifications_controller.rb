module Pageflow
  # @api private
  class CommentNotificationsController < Pageflow::ApplicationController
    SCOPE = 'pageflow.admin.entries.comments.notifications'.freeze

    # The signature in the token is what authorizes the request. A mail
    # client posting from its unsubscribe button carries nothing else.
    skip_forgery_protection only: :mute

    def mute
      user, entry = EntryCommentMuteToken.find(params[:token])
      return render_expired_link unless entry

      EntryCommentNotificationOverride.set(entry:, user:, level: CommentNotificationLevel::MUTED)

      # The client posts from its own unsubscribe button and shows
      # nothing but whether it worked.
      return head(:ok) if request.post?

      redirect_to(main_app.admin_entry_path(entry), notice: t("#{SCOPE}.muted_notice"))
    end

    private

    def render_expired_link
      return head(:not_found) if request.post?

      redirect_to(main_app.admin_root_path, alert: t("#{SCOPE}.expired_notice"))
    end
  end
end
