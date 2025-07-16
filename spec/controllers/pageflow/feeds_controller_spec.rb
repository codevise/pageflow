require 'spec_helper'

module Pageflow
  describe FeedsController do
    include UsedFileTestHelper

    routes { Engine.routes }
    render_views

    describe '#index' do
      it 'reponds with atom feed' do
        site = create(:site, cname: 'pageflow.example.com')
        create(:entry,
               :published,
               title: 'story one',
               site:,
               published_revision_attributes: {
                 title: 'Story One',
                 locale: 'en',
                 summary: 'This is <b>the</b> story.'
               })
        create(:entry,
               :published,
               site:,
               published_revision_attributes: {
                 title: 'Story Two',
                 locale: 'en'
               })
        create(:entry,
               :published,
               site:,
               published_revision_attributes: {
                 title: 'Story Three',
                 locale: 'en'
               })
        create(:entry,
               :published,
               site:,
               published_revision_attributes: {
                 title: 'Story Three',
                 locale: 'en'
               })
        request.env['HTTP_HOST'] = 'pageflow.example.com'
        get(:index, params: {locale: 'en'}, format: 'atom')

        expect(response.status).to eq(200)
        expect(without_namespaces(response.body)).to have_xpath('//feed[@lang="en"]')
        expect(response.body).to have_xpath('//feed/updated')
        expect(response.body).to have_xpath('//feed/title', text: 'pageflow.example.com')
        expect(response.body).to have_xpath(
          '//feed/link[@rel="alternate"][@href="http://pageflow.example.com"]'
        )
        expect(response.body).to have_xpath(
          '//feed/link[@rel="self"][@href="http://pageflow.example.com/feeds/en.atom"]'
        )
        expect(response.body).to have_xpath('//entry/title', text: 'Story One')
        expect(response.body).to have_xpath('//entry/title', text: 'Story Two')
        expect(response.body).to have_xpath('//entry/content', text: 'This is <b>the</b> story.')
        expect(response.body).to have_xpath(
          '//entry/link[@rel="alternate"][@href="http://pageflow.example.com/story-one"]'
        )
      end

      it 'uses custom feed url of site as self' do
        create(:site,
               cname: 'pageflow.example.com',
               custom_feed_url: 'https://custom.example.com/:locale/feed.atom')

        request.env['HTTP_HOST'] = 'pageflow.example.com'
        get(:index, params: {locale: 'en'}, format: 'atom')

        expect(response.body).to have_xpath('//feed/link[@rel="self"]' \
                                            '[@href="https://custom.example.com/en/feed.atom"]')
      end

      it 'uses canonical_entry_url_prefix of site as alternate' do
        create(:site,
               cname: 'pageflow.example.com',
               canonical_entry_url_prefix: 'https://example.com/:locale/')

        request.env['HTTP_HOST'] = 'pageflow.example.com'
        get(:index, params: {locale: 'en'}, format: 'atom')

        expect(response.body).to have_xpath('//feed/link[@rel="alternate"]' \
                                            '[@href="https://example.com/en/"]')
      end

      it 'uses permalinks in alternate url' do
        site = create(:site, cname: 'pageflow.example.com')
        create(:entry,
               :published,
               site:,
               permalink_attributes: {slug: 'custom-slug'},
               published_revision_attributes: {locale: 'en'})

        request.env['HTTP_HOST'] = 'pageflow.example.com'
        get(:index, params: {locale: 'en'}, format: 'atom')

        expect(response.body).to have_xpath(
          '//entry/link[@rel="alternate"][@href="http://pageflow.example.com/custom-slug"]'
        )
      end

      it 'includes social share image in content' do
        site = create(:site, cname: 'pageflow.example.com')
        entry = create(:published_entry,
                       site:,
                       revision_attributes: {
                         locale: 'en'
                       })
        image_file = create_used_file(:image_file, entry:, file_name: 'share.jpg')
        entry.revision.update(share_image_id: image_file.perma_id)

        request.env['HTTP_HOST'] = 'pageflow.example.com'
        get(:index, params: {locale: 'en'}, format: 'atom')

        expect(response.body)
          .to have_xpath('//entry/content',
                         text: %(<img src="#{image_file.thumbnail_url(:thumbnail_large)}"))
      end

      it 'includes link to entry in content' do
        site = create(:site, cname: 'pageflow.example.com')
        create(:entry,
               :published,
               title: 'Story One',
               site:,
               published_revision_attributes: {
                 locale: 'en'
               })

        request.env['HTTP_HOST'] = 'pageflow.example.com'
        get(:index, params: {locale: 'en'}, format: 'atom')

        expect(response.body)
          .to have_xpath('//entry/content',
                         text: %(<a href="http://pageflow.example.com/story-one"))
      end

      it 'includes publication dates' do
        first_publication_date = 1.month.ago
        last_publication_date = 3.days.ago
        site = create(:site, cname: 'pageflow.example.com')
        create(:entry,
               :published,
               site:,
               first_published_at: first_publication_date,
               published_revision_attributes: {
                 locale: 'en',
                 published_at: last_publication_date
               })

        request.env['HTTP_HOST'] = 'pageflow.example.com'
        get(:index, params: {locale: 'en'}, format: 'atom')

        expect(response.body).to have_xpath('//entry/published',
                                            text: first_publication_date.iso8601)
        expect(response.body).to have_xpath('//entry/updated',
                                            text: last_publication_date.iso8601)
      end

      it 'includes author from metadata' do
        site = create(:site, cname: 'pageflow.example.com')
        create(:entry,
               :published,
               site:,
               published_revision_attributes: {
                 locale: 'en',
                 author: 'Alice Adminson, Alina Publisha, Ed Edison'
               })

        request.env['HTTP_HOST'] = 'pageflow.example.com'
        get(:index, params: {locale: 'en'}, format: 'atom')

        expect(response.body)
          .to have_xpath('//entry/author/name', text: 'Alice Adminson, Alina Publisha, Ed Edison')
      end

      it 'filters entries by locale' do
        site = create(:site, cname: 'pageflow.example.com')
        create(:entry,
               :published,
               site:,
               published_revision_attributes: {
                 title: 'Story One',
                 locale: 'en'
               })
        create(:entry,
               :published,
               site:,
               published_revision_attributes: {
                 title: 'Story Eins',
                 locale: 'de'
               })

        request.env['HTTP_HOST'] = 'pageflow.example.com'
        get(:index, params: {locale: 'de'}, format: 'atom')

        expect(without_namespaces(response.body)).to have_xpath('//feed[@lang="de"]')
        expect(response.body).to have_xpath('//entry/title', text: 'Story Eins')
        expect(response.body).not_to have_xpath('//entry/title', text: 'Story One')
      end

      it 'filters entries by site' do
        site = create(:site, cname: 'pageflow.example.com')
        other_site = create(:site, cname: 'pageflow.example.com')
        create(:entry,
               :published,
               site:,
               published_revision_attributes: {
                 title: 'Story One',
                 locale: 'en'
               })
        create(:entry,
               :published,
               site: other_site,
               published_revision_attributes: {
                 title: 'Other Story',
                 locale: 'en'
               })

        request.env['HTTP_HOST'] = 'pageflow.example.com'
        get(:index, params: {locale: 'en'}, format: 'atom')

        expect(response.body).to have_xpath('//entry/title', text: 'Story One')
        expect(response.body).not_to have_xpath('//entry/title', text: 'Other Story')
      end

      it 'filters out unpublished or password protected entries' do
        site = create(:site, cname: 'pageflow.example.com')
        create(:entry,
               site:,
               draft_attributes: {
                 title: 'Unfinished Story',
                 locale: 'en'
               })
        create(:entry,
               :published_with_password,
               site:,
               published_revision_attributes: {
                 title: 'Secret',
                 locale: 'en'
               })

        request.env['HTTP_HOST'] = 'pageflow.example.com'
        get(:index, params: {locale: 'en'}, format: 'atom')

        expect(response.body).not_to have_xpath('//entry')
      end

      it 'responds with 404 for unknown site' do
        site = create(:site, cname: 'pageflow.example.com')
        create(:entry,
               :published,
               site:,
               published_revision_attributes: {
                 title: 'Story One',
                 locale: 'en'
               })

        request.env['HTTP_HOST'] = 'unknown.example.com'
        get(:index, params: {locale: 'en'}, format: 'atom')

        expect(response.status).to eq(404)
      end

      it 'responds with 404 unless feeds enabled for site' do
        site = create(:site,
                      cname: 'pageflow.example.com',
                      feeds_enabled: false)
        create(:entry,
               :published,
               site:,
               published_revision_attributes: {
                 title: 'Story One',
                 locale: 'en'
               })

        request.env['HTTP_HOST'] = 'pageflow.example.com'
        get(:index, params: {locale: 'en'}, format: 'atom')

        expect(response.status).to eq(404)
      end
    end

    # Nokogiri does not handle the xml:lang attribute in XPath
    # expressions correctly since it requires all namespaces to be
    # registered on the root node.
    def without_namespaces(xml)
      Nokogiri::XML(xml).remove_namespaces!.to_xml
    end
  end
end
