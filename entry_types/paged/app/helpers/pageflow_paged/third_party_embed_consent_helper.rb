module PageflowPaged
  # Render opt-in placeholders for embeds and opt-out hints.
  module ThirdPartyEmbedConsentHelper
    include Pageflow::EntriesHelper

    def third_party_embed_opt_in(entry:, vendor_name:, message:)
      link_html = third_party_embed_privacy_link(
        entry:,
        text: t('pageflow.public.third_party_embed_consent.opt_in.more_information'),
        vendor_name:
      )

      render('pageflow_paged/third_party_embed_consent/opt_in',
             message:,
             vendor_name:,
             link_html:)
    end

    def third_party_embed_opt_out_info(entry)
      link_html = third_party_embed_privacy_link(
        entry:,
        text: t('pageflow.public.third_party_embed_consent.opt_out_info.prompt_link')
      )

      render('pageflow_paged/third_party_embed_consent/opt_out_info', link_html:)
    end

    def third_party_embed_privacy_link(entry:, text:, vendor_name: nil)
      params = vendor_name ? "&vendors=#{vendor_name}" : ''

      link_to(
        text,
        "#{entry_privacy_link_url(entry)}#{params}#consent",
        target: '_blank', rel: 'noopener noreferrer'
      )
    end
  end
end
