module Pageflow
  # Use as {Configuration#public_entry_redirect} to make sure entries
  # are accessed via their account's configured cname.
  #
  # @since 12.4
  class PrimaryDomainEntryRedirect
    def call(entry, request)
      site = entry.site

      if site.cname.present? &&
         !known_domains(site).include?(request.host)
        [request.protocol, site.cname, request.fullpath].join
      end
    end

    private

    def known_domains(site)
      [
        site.cname,
        (site.additional_cnames || '').split(',').map(&:strip)
      ].flatten
    end
  end
end
