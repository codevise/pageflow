require 'spec_helper'

module PageflowPaged
  RSpec.describe ThirdPartyEmbedConsentHelper, type: :helper do
    describe '#third_party_embed_opt_in' do
      it 'renders button with data-consent-vendor attribute' do
        entry = create(:published_entry)

        html = helper.third_party_embed_opt_in(entry:,
                                               message: 'I agree',
                                               vendor_name: 'some-vendor')

        expect(html).to have_selector('button[data-consent-vendor="some-vendor"]')
      end

      it 'renders link to consent section of privacy page' do
        site = create(:site, privacy_link_url: 'http://example.com/privacy')
        entry = create(:published_entry, site:)

        html = helper.third_party_embed_opt_in(entry:,
                                               message: 'I agree',
                                               vendor_name: 'some-vendor')

        expect(html).to have_selector(
          'a[href="http://example.com/privacy?lang=en&vendors=some-vendor#consent"]'
        )
      end
    end

    describe '#third_party_embed_opt_out_info' do
      it 'renders link to consent section of privacy page' do
        site = create(:site, privacy_link_url: 'http://example.com/privacy')
        entry = create(:published_entry, site:)

        html = helper.third_party_embed_opt_out_info(entry)

        expect(html).to have_selector('a[href="http://example.com/privacy?lang=en#consent"]')
      end
    end
  end
end
