module PageflowScrolled
  # Links to other entries only resolve with a signature generated
  # for an editor allowed to read the linked entry. Otherwise editors
  # could reveal titles of entries they can not access by adding
  # links with arbitrary entry ids.
  #
  # @api private
  module EntryLinkSignature
    PURPOSE = :entry_link
    private_constant :PURPOSE

    class << self
      def generate(entry_id, chapter: nil, section: nil)
        verifier.generate(payload(entry_id, chapter:, section:), purpose: PURPOSE)
      end

      def valid?(entry_id, signature, chapter: nil, section: nil)
        signature.is_a?(String) &&
          verifier.verified(signature, purpose: PURPOSE) ==
            payload(entry_id, chapter:, section:)
      end

      private

      def payload(entry_id, chapter:, section:)
        if chapter
          [entry_id, 'chapter', chapter]
        elsif section
          [entry_id, 'section', section]
        else
          entry_id
        end
      end

      def verifier
        Rails.application.message_verifier('pageflow_scrolled_entry_link')
      end
    end
  end
end
