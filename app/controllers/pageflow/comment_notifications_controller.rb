module Pageflow
  # @api private
  class CommentNotificationsController < Pageflow::ApplicationController
    SCOPE = 'pageflow.admin.entries.comments.notifications'.freeze

    def mute
      user, entry = EntryCommentMuteToken.find(params[:token])

      unless entry
        return redirect_to(main_app.admin_root_path,
                           alert: t("#{SCOPE}.expired_notice"))
      end

      EntryCommentNotificationOverride.set(entry:, user:, level: CommentNotificationLevel::MUTED)

      redirect_to(main_app.admin_entry_path(entry), notice: t("#{SCOPE}.muted_notice"))
    end
  end
end
