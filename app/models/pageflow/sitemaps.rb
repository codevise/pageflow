module Pageflow
  # @api private
  module Sitemaps
    def self.entries_for(site:)
      PublishedEntry.wrap_all(
        site
          .entries
          .published_without_password_protection
          .order('first_published_at DESC')
      )
    end
  end
end
