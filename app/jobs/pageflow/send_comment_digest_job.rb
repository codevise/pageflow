require 'net/smtp'

module Pageflow
  # The digest is built at delivery, so that read marks and levels as
  # they stand then decide what it says. The window travels in the
  # arguments, so a retry mails the same one.
  #
  # @api private
  class SendCommentDigestJob < ApplicationJob
    queue_as :comment_digests

    retry_on Net::SMTPServerBusy, Net::OpenTimeout, Net::ReadTimeout,
             wait: :polynomially_longer, attempts: 5

    # A rejected recipient is rejected again on every attempt.
    discard_on Net::SMTPFatalError, Net::SMTPSyntaxError

    def perform(user, entry, since:, until_at:)
      digest = CommentDigest.for(user, entry, since:, until_at:)

      UserMailer.comment_digest(digest).deliver_now if digest
    end
  end
end
