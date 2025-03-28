module Pageflow
  # @api private
  module Sitemaps
    def self.entries_for(site:)
      PublishedEntry.wrap_all(
        site
          .entries
          .preload(:account,
                   permalink: :directory,
                   translation_group: {
                     publicly_visible_entries: [
                       :account,
                       :published_revision,
                       {permalink: :directory}
                     ]
                   })
          .published_without_password_protection
          .published_without_noindex
          .order(first_published_at: :desc)
      )
    end
  end
end
