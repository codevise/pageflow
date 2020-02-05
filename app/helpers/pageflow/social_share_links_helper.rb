module Pageflow
  module SocialShareLinksHelper
    include SocialShareHelper

    PROVIDER_URL_TEMPLATES = {
      email: 'mailto:?body=%{url}',
      facebook: 'http://www.facebook.com/sharer/sharer.php?u=%{url}',
      google: 'https://plus.google.com/share?url=%{url}',
      linked_in: 'https://www.linkedin.com/shareArticle?mini=true&url=%{url}',
      telegram: 'tg://msg?text=%{url}',
      twitter: 'https://twitter.com/intent/tweet?url=%{url}',
      whats_app: 'WhatsApp://send?text=%{url}'
    }.freeze

    def social_share_link(provider, entry, &block)
      block ||= ->() {}
      page_share_link_url = social_share_link_url(provider, social_share_page_url(entry, 'permaId'))
      data_attributes = entry.share_url.present? ? {} : {share_page: page_share_link_url}

      link_to(social_share_link_url(provider, social_share_entry_url(entry)),
              target: '_blank',
              tabindex: '2',
              class: ['share', provider],
              data: data_attributes,
              &block)
    end

    def share_provider_url_templates
      PROVIDER_URL_TEMPLATES
    end

    private

    def social_share_link_url(provider, url)
      return nil if url.blank?
      encoded_url = ERB::Util.url_encode(url)
      format(PROVIDER_URL_TEMPLATES[provider], url: encoded_url)
    end
  end
end
