module Pageflow
  # @api private
  module Sitemaps
    def self.entries_for(site:)
      PublishedEntry.wrap_all(
        site
          .entries
          .preload(permalink: :directory,
                   published_translations: [
                     :published_revision,
                     {permalink: :directory}
                   ])
          .published_without_password_protection
          .published_without_noindex
          .order(first_published_at: :desc)
      )
    end
  end
end
