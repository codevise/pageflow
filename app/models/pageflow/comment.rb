module Pageflow
  # @api private
  class Comment < ApplicationRecord
    include NestedRevisionComponent

    # Quotes are recorded by the client, so cut rather than reject: an
    # unexpectedly long selection must not keep a comment from being saved.
    # Kept in sync with the limit quote extraction applies in
    # entry_types/scrolled/package/src/review/subjectQuote.js, so that a
    # recorded quote stays comparable to the text as it reads later on.
    QUOTE_LIMIT = 4_000

    belongs_to :comment_thread
    belongs_to :creator, class_name: 'User'

    validates :body, presence: true

    before_validation :truncate_quote

    def entry_for_auto_generated_perma_id
      comment_thread.revision.entry
    end

    private

    def truncate_quote
      self.quote = quote[0, QUOTE_LIMIT] if quote
    end
  end
end
