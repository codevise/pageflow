require 'spec_helper'

module Pageflow
  describe SocialShareLinksHelper do
    describe '#social_share_link' do
      it 'add provider class to link' do
        entry = create(:entry, :published)
        published_entry = PublishedEntry.new(entry)

        html = helper.social_share_link(:facebook, published_entry)

        expect(html).to have_selector('a.share.facebook')
      end

      it 'has data-share-page attribute with page share link template' do
        entry = create(:entry, :published)
        published_entry = PublishedEntry.new(entry)

        html = helper.social_share_link(:facebook, published_entry)

        expect(html).to have_selector('a[data-share-page$="%3Fpage%3DpermaId"]')
      end

      it 'does not have data-share-page attribute if custom share url is present' do
        entry = create(:entry, :published, published_revision_attributes: {
                         share_url: 'http://example.com/my_entry'
                       })
        published_entry = PublishedEntry.new(entry)

        html = helper.social_share_link(:facebook, published_entry)

        expect(html).not_to have_selector('[data-share-page]')
      end
    end

    describe '#share_provider_url_templates' do
      it 'returns url templates with url-token' do
        provider_url_templates = helper.share_provider_url_templates

        expect(provider_url_templates).to have_key(:facebook)
        expect(provider_url_templates[:facebook])
          .to eq('http://www.facebook.com/sharer/sharer.php?u=%<url>s')
        expect(provider_url_templates[:bluesky])
          .to eq('https://bsky.app/intent/compose?text=%<url>s')
      end
    end
  end
end
