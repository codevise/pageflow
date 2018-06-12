module Pageflow
  # Use as {Configuration#public_entry_redirect} to make sure entries
  # are accessed via their account's configured cname.
  #
  # @since 12.4
  class PrimaryDomainEntryRedirect
    def call(entry, request)
      theming = entry.theming

      if theming.cname.present? &&
         !known_domains(theming).include?(request.host)
        [request.protocol, theming.cname, request.fullpath].join
      end
    end

    private

    def known_domains(theming)
      [
        theming.cname,
        (theming.additional_cnames || '').split(',').map(&:strip)
      ].flatten
    end
  end
end
