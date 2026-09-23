module Pageflow
  # Lets a comment digest mail carry a mute link that works before the
  # recipient has signed in. The signature is all that stands between
  # the link and anyone who gets a browser to follow it.
  #
  # @api private
  module EntryCommentMuteToken
    EXPIRES_IN = 60.days

    class << self
      def generate(user:, entry:)
        verifier.generate([user.id, entry.id], expires_in: EXPIRES_IN)
      end

      # The user and entry the token names, or nothing if the signature
      # does not check out, the link has expired or either record is gone.
      def find(token)
        user_id, entry_id = verifier.verified(token.to_s)
        return unless user_id

        user = User.find_by(id: user_id)
        entry = Entry.find_by(id: entry_id)

        [user, entry] if user && entry
      end

      private

      def verifier
        Rails.application.message_verifier('pageflow/entry_comment_mute')
      end
    end
  end
end
