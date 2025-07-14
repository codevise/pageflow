module Pageflow
  # Helpers to render alternate links to atom feeds.
  #
  # @since 16.1
  module FeedsHelper
    # Render alternate links to atom feed of entries in the same site
    # using the same locale.
    def feed_link_tags_for_entry(entry)
      return '' unless entry.site.feeds_enabled?

      href =
        entry.site.custom_feed_url.presence&.gsub(':locale', entry.locale) ||
        pageflow.feed_url(
          {
            locale: entry.locale,
            format: 'atom'
          }.merge(Pageflow.config.site_url_options_for(entry.site) || {})
        )

      tag(:link,
          rel: 'alternate',
          type: 'application/atom+xml',
          title: 'Feed',
          href:)
    end

    # @api private
    def feed_entry_content(entry)
      FeedContent.new(self, entry).build
    end

    # @api private
    FeedContent = Struct.new(:template, :entry) do
      def build
        [image_html, summary_html, link_html].compact.join
      end

      private

      def image_html
        return if entry.thumbnail_file.blank?

        template.content_tag(
          :p,
          template.tag(
            :img,
            src: entry.thumbnail_file.thumbnail_url(:thumbnail_large),
            width: 560, height: 315
          )
        )
      end

      def summary_html
        template.content_tag(:p, template.raw(entry.summary))
      end

      def link_html
        template.content_tag(
          :p,
          template.link_to(template.t('pageflow.public.read_more'),
                           template.social_share_entry_url(entry))
        )
      end
    end
  end
end
