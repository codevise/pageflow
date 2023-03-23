module Pageflow
  # Helpers to render alternate links to atom feeds.
  #
  # @since edge
  module FeedsHelper
    # Render alternate links to atom feed of entries in the same site
    # using the same locale.
    def feed_link_tags_for_entry(entry)
      return '' unless entry.site.feeds_enabled?

      href = pageflow.feed_url({
        locale: entry.locale,
        format: 'atom'
      }.merge(Pageflow.config.site_url_options(entry.site) || {}))

      tag(:link,
          rel: 'alternate',
          type: 'application/atom+xml',
          title: 'Feed',
          href: href)
    end
  end
end
