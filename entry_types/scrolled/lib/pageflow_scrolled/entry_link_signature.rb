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
      def generate(entry_id)
        verifier.generate(entry_id, purpose: PURPOSE)
      end

      def valid?(entry_id, signature)
        signature.is_a?(String) &&
          verifier.verified(signature, purpose: PURPOSE) == entry_id
      end

      private

      def verifier
        Rails.application.message_verifier('pageflow_scrolled_entry_link')
      end
    end
  end
end
