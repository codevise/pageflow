module Pageflow
  # Only moved forward once the entry has been swept, which leaves a
  # sweep that never ran the whole window for the next one to cover.
  #
  # Not read state: it records what has been considered, not what has
  # been seen, and it moves even when the sweep mailed nobody.
  #
  # @api private
  class CommentDigestWatermark < ApplicationRecord
    belongs_to :entry

    validates :considered_up_to, presence: true

    def self.considered_up_to_by_entry_id
      pluck(:entry_id, :considered_up_to).to_h
    end

    def self.record!(entry, time)
      find_or_initialize_by(entry:).update!(considered_up_to: time)
    end
  end
end
