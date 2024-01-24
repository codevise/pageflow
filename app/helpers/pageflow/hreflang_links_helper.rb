module Pageflow
  # Helpers to render alternate links to translations of an entry.
  #
  # @since edge
  module HreflangLinksHelper
    include SocialShareHelper

    # Render alternate links to all published entries that have been
    # marked as translations of the given entry.
    def hreflang_link_tags_for_entry(entry)
      translations =
        entry.translations(-> { preload(:site, :translation_group, permalink: :directory) })

      safe_join(
        translations.each_with_object([]) do |translation, links|
          links << hreflang_link_tag(translation)

          if translation.default_translation?
            links << hreflang_link_tag(translation, hreflang: 'x-default')
          end
        end
      )
    end

    private

    def hreflang_link_tag(entry, hreflang: entry.locale)
      tag('link',
          rel: 'alternate',
          hreflang:,
          href: social_share_entry_url(entry))
    end
  end
end
