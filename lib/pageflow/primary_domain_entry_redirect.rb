module Pageflow
  # Use as {Configuration#public_entry_redirect} to make sure entries
  # are accessed via their account's configured cname.
  #
  # @since 12.4
  class PrimaryDomainEntryRedirect
    def initialize(ignore_additional_cnames: false)
      @ignore_additional_cnames = ignore_additional_cnames
    end

    def call(entry, request)
      site = entry.site

      if site.cname.present? &&
         !known_domains(site).include?(request.host)
        [request.protocol, site.cname, request.fullpath].join
      end
    end

    private

    def known_domains(site)
      return [site.cname] if @ignore_additional_cnames

      [
        site.cname,
        (site.additional_cnames || '').split(',').map(&:strip)
      ].flatten
    end
  end
end
