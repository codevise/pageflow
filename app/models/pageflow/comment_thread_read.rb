module Pageflow
  # Records when a user last read a comment thread. Keyed by perma id
  # so read state survives comment threads being copied to a new
  # revision.
  #
  # @api private
  class CommentThreadRead < ApplicationRecord
    belongs_to :entry
    belongs_to :user

    def self.read_at_by_perma_id(entry:, user:)
      where(entry:, user:).pluck(:comment_thread_perma_id, :read_at).to_h
    end

    def self.read_at_by_entry_id(entries:, user:)
      where(user:, entry_id: entries.map(&:id))
        .pluck(:entry_id, :comment_thread_perma_id, :read_at)
        .group_by(&:first)
        .transform_values do |rows|
          rows.to_h { |(_entry_id, perma_id, read_at)| [perma_id, read_at] }
        end
    end

    def self.mark(entry:, user:, comment_thread_perma_ids:, read_at: Time.current)
      comment_thread_perma_ids.each do |perma_id|
        find_or_initialize_by(entry:, user:, comment_thread_perma_id: perma_id)
          .update!(read_at:)
      end
    end
  end
end
