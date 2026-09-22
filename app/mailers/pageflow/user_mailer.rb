module Pageflow
  # @api private
  class UserMailer < ActionMailer::Base
    helper CommentDigestHelper

    def comment_digest(digest)
      @digest = digest
      @user = digest.user
      @entry = digest.entry
      @level = CommentNotifications.for_entry(@entry, user: @user).level
      @mute_token = EntryCommentMuteToken.generate(user: @user, entry: @entry)

      I18n.with_locale(@user.locale) do
        headers('X-Language' => I18n.locale,
                'References' => entry_message_id(@entry),
                'In-Reply-To' => entry_message_id(@entry))
        mail(to: @user.email,
             subject: t('.subject', title: @entry.title),
             from: Pageflow.config.mailer_sender)
      end
    end

    def invitation(options)
      @user = options[:user]
      @password_token = options[:password_token]

      I18n.with_locale(@user.locale) do
        headers('X-Language' => I18n.locale)
        mail(to: @user.email, subject: t('.subject'), from: Pageflow.config.mailer_sender)
      end
    end

    private

    # No message has ever been sent under this id. A threading client
    # only needs every digest for an entry to name the same parent.
    def entry_message_id(entry)
      domain = Mail::Address.new(Pageflow.config.mailer_sender).domain

      "<pageflow-entry-#{entry.id}@#{domain}>"
    end
  end
end
