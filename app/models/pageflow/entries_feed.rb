module Pageflow
  # @api private
  EntriesFeed = Struct.new(:title, :locale, :entries) do
    def updated_at
      entries.map(&:published_at).max
    end

    class << self
      def for(site:, locale:)
        new(
          site.title.presence || site.host,
          locale,
          find_entries(site, locale)
        )
      end

      private

      def find_entries(site, locale)
        Pageflow::PublishedEntry.wrap_all(
          site
            .entries
            .published_without_password_protection
            .where(pageflow_revisions: {locale: locale})
            .order('first_published_at DESC')
        )
      end
    end
  end
end
