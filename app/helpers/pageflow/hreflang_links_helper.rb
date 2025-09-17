module Pageflow
  # Helpers to render alternate links to translations of an entry.
  #
  # @since 17.1
  module HreflangLinksHelper
    include SocialShareHelper

    # Render alternate links to all published entries that have been
    # marked as translations of the given entry.
    def hreflang_link_tags_for_entry(entry)
      safe_join(
        translations_for_hreflang_links(entry).each_with_object([]) do |translation, links|
          links << hreflang_link_tag(translation)

          if translation.default_translation?
            links << hreflang_link_tag(translation, hreflang: 'x-default')
          end
        end
      )
    end

    private

    def translations_for_hreflang_links(entry)
      entry.translations(
        -> { preload(:site, :account, :translation_group, permalink: :directory) }
      )
    end

    def hreflang_link_tag(entry, hreflang: entry.locale)
      tag('link',
          rel: 'alternate',
          hreflang:,
          href: social_share_entry_url(entry))
    end
  end
end
