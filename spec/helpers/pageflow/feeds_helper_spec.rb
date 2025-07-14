require 'spec_helper'

module Pageflow
  describe FeedsHelper do
    before(:each) do
      helper.extend(Pageflow::Engine.routes.url_helpers)
    end

    describe '#feed_link_tag_for_entry' do
      it 'renders alternate link tag based on entry locale' do
        site = create(:site, cname: 'pageflow.example.com')
        entry = create(:published_entry,
                       site:,
                       revision_attributes: {
                         locale: 'de'
                       })

        result = helper.feed_link_tags_for_entry(entry)

        expect(result)
          .to have_selector('link[rel="alternate"][type="application/atom+xml"]' \
                            '[title="Feed"]' \
                            '[href="http://pageflow.example.com/feeds/de.atom"]',
                            visible: false)
      end

      it 'uses custom feed url of site' do
        site = create(:site, custom_feed_url: 'https://example.com/custom.atom')
        entry = create(:published_entry,
                       site:,
                       revision_attributes: {
                         locale: 'de'
                       })

        result = helper.feed_link_tags_for_entry(entry)

        expect(result)
          .to have_selector('link[href="https://example.com/custom.atom"]',
                            visible: false)
      end

      it 'ignores emptry custom feed url' do
        site = create(:site,
                      cname: 'pageflow.example.com',
                      custom_feed_url: '')
        entry = create(:published_entry,
                       site:,
                       revision_attributes: {
                         locale: 'de'
                       })

        result = helper.feed_link_tags_for_entry(entry)

        expect(result)
          .to have_selector('link[href="http://pageflow.example.com/feeds/de.atom"]',
                            visible: false)
      end

      it 'supports interpolating entry locale in custom feed url' do
        site = create(:site, custom_feed_url: 'https://example.com/:locale/custom.atom')
        entry = create(:published_entry,
                       site:,
                       revision_attributes: {
                         locale: 'de'
                       })

        result = helper.feed_link_tags_for_entry(entry)

        expect(result)
          .to have_selector('link[href="https://example.com/de/custom.atom"]',
                            visible: false)
      end

      it 'renders nothing when feeds are not enabled in site' do
        site = create(:site,
                      cname: 'pageflow.example.com',
                      feeds_enabled: false)
        entry = create(:published_entry,
                       site:,
                       revision_attributes: {
                         locale: 'de'
                       })

        result = helper.feed_link_tags_for_entry(entry)

        expect(result).to be_blank
      end
    end
  end
end
