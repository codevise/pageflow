module Pageflow
  # Records when a user last read a comment thread. Keyed by perma id
  # so read state survives comment threads being copied to a new
  # revision.
  #
  # @api private
  class CommentThreadRead < ApplicationRecord
    belongs_to :entry
    belongs_to :user

    def self.mark(entry:, user:, comment_thread_perma_ids:, read_at: Time.current)
      comment_thread_perma_ids.each do |perma_id|
        find_or_initialize_by(entry:, user:, comment_thread_perma_id: perma_id)
          .update!(read_at:)
      end
    end
  end
end
