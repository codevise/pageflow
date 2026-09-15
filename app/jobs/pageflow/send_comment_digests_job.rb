module Pageflow
  # @api private
  class SendCommentDigestsJob < ApplicationJob
    queue_as :comment_digests

    def perform
      CommentDigest.sweep(
        at: Time.current,
        max_lookback: Pageflow.config.comment_digest_max_lookback
      ) do |entry_digest|
        SendCommentDigestJob.perform_later(entry_digest.user, entry_digest.entry,
                                           since: entry_digest.since,
                                           until_at: entry_digest.until_at)
      end
    end
  end
end
