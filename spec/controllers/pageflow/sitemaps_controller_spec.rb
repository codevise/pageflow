require 'spec_helper'

module Pageflow
  describe SitemapsController do
    routes { Engine.routes }
    render_views

    describe '#index' do
      it 'reponds with sitemap XML' do
        site = create(:site, cname: 'pageflow.example.com')
        create(:entry,
               :published,
               title: 'Story One',
               site:,
               published_revision_attributes: {
                 published_at: 3.days.ago
               })
        create(:entry,
               :published,
               title: 'Story Two',
               site:,
               permalink_attributes: {
                 slug: 'custom-slug'
               },
               published_revision_attributes: {
                 published_at: 2.days.ago
               })

        request.env['HTTP_HOST'] = 'pageflow.example.com'
        get(:index, format: 'xml')

        expect(response.status).to eq(200)
        expect(response.body)
          .to have_xpath('//urlset[@xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"]')
        expect(response.body).to have_xpath('//urlset/url/loc',
                                            text: 'http://pageflow.example.com/story-one')
        expect(response.body).to have_xpath('//urlset/url/lastmod',
                                            text: 3.days.ago.iso8601)
        expect(response.body).to have_xpath('//urlset/url/loc',
                                            text: 'http://pageflow.example.com/custom-slug')
        expect(response.body).to have_xpath('//urlset/url/lastmod',
                                            text: 2.days.ago.iso8601)
      end

      it 'filters entries by site' do
        create(:site, cname: 'pageflow.example.com')
        other_site = create(:site, cname: 'pageflow.example.com')
        create(:entry, :published, site: other_site)

        request.env['HTTP_HOST'] = 'pageflow.example.com'
        get(:index, format: 'xml')

        expect(response.body).not_to have_xpath('//url')
      end

      it 'filters out unpublished, noindex or password protected entries' do
        site = create(:site, cname: 'pageflow.example.com')
        create(:entry, site:)
        create(:entry, :published_with_password, site:)
        create(:entry, :published_with_noindex, site:)

        request.env['HTTP_HOST'] = 'pageflow.example.com'
        get(:index, format: 'xml')

        expect(response.body).not_to have_xpath('//url')
      end

      it 'renders links to entry translations' do
        site = create(:site, cname: 'pageflow.example.com')
        en_entry = create(
          :entry,
          :published,
          title: 'Story One',
          site:,
          permalink_attributes: {
            slug: 'story-one',
            directory_path: 'en/'
          },
          published_revision_attributes: {
            locale: 'en'
          }
        )
        de_entry = create(
          :entry,
          :published,
          title: 'Erster Beitrag',
          site:,
          permalink_attributes: {
            slug: 'erster-beitrag',
            directory_path: 'de/'
          },
          published_revision_attributes: {
            locale: 'de'
          }
        )
        en_entry.mark_as_translation_of(de_entry)
        en_entry2 = create(
          :entry,
          :published,
          title: 'Story two',
          site:,
          permalink_attributes: {
            slug: 'story-two',
            directory_path: 'en/'
          },
          published_revision_attributes: {
            locale: 'en'
          }
        )
        de_entry2 = create(
          :entry,
          :published,
          title: 'Deux',
          site:,
          permalink_attributes: {
            slug: 'deux',
            directory_path: 'fr/'
          },
          published_revision_attributes: {
            locale: 'fr'
          }
        )
        en_entry2.mark_as_translation_of(de_entry2)

        request.env['HTTP_HOST'] = 'pageflow.example.com'

        detect_n_plus_one_queries do
          get(:index, format: 'xml')
        end

        expect(response.status).to eq(200)
        expect(response.body)
          .to include('xmlns:xhtml="http://www.w3.org/1999/xhtml')
        expect(response.body)
          .to have_xpath('//urlset/url[*[@rel="alternate" and @hreflang="de"' \
                         ' and @href="http://pageflow.example.com/de/erster-beitrag"]]/loc',
                         text: 'http://pageflow.example.com/en/story-one')
        expect(response.body)
          .to have_xpath('//urlset/url[*[@rel="alternate" and @hreflang="en"' \
                         ' and @href="http://pageflow.example.com/en/story-one"]]/loc',
                         text: 'http://pageflow.example.com/en/story-one')
        expect(response.body)
          .to have_xpath('//urlset/url[*[@rel="alternate" and @hreflang="de"' \
                         ' and @href="http://pageflow.example.com/de/erster-beitrag"]]/loc',
                         text: 'http://pageflow.example.com/de/erster-beitrag')
        expect(response.body)
          .to have_xpath('//urlset/url[*[@rel="alternate" and @hreflang="en"' \
                         ' and @href="http://pageflow.example.com/en/story-one"]]/loc',
                         text: 'http://pageflow.example.com/de/erster-beitrag')
      end

      it 'does not render links to non-published entry translations' do
        site = create(:site, cname: 'pageflow.example.com')
        entry = create(
          :entry,
          :published,
          site:,
          published_revision_attributes: {
            locale: 'en'
          }
        )
        entry.mark_as_translation_of(
          create(
            :entry,
            :published_with_password,
            site:,
            published_revision_attributes: {
              locale: 'de'
            }
          )
        )
        entry.mark_as_translation_of(
          create(
            :entry,
            :published_with_noindex,
            site:,
            published_revision_attributes: {
              locale: 'es'
            }
          )
        )
        entry.mark_as_translation_of(
          create(
            :entry,
            site:,
            draft_attributes: {
              locale: 'fr'
            }
          )
        )

        request.env['HTTP_HOST'] = 'pageflow.example.com'

        get(:index, format: 'xml')

        expect(response.status).to eq(200)
        expect(response.body).not_to have_xpath('//*[@rel="alternate" and @hreflang="de"]')
        expect(response.body).not_to have_xpath('//*[@rel="alternate" and @hreflang="es"]')
        expect(response.body).not_to have_xpath('//*[@rel="alternate" and @hreflang="fr"]')
      end

      it 'responds with 404 for unknown site' do
        site = create(:site, cname: 'pageflow.example.com')
        create(:entry, :published, site:)

        request.env['HTTP_HOST'] = 'unknown.example.com'
        get(:index, format: 'xml')

        expect(response.status).to eq(404)
      end

      it 'responds with 404 unless sitemap enabled for site' do
        site = create(:site,
                      cname: 'pageflow.example.com',
                      sitemap_enabled: false)
        create(:entry, :published, site:)

        request.env['HTTP_HOST'] = 'pageflow.example.com'
        get(:index, format: 'xml')

        expect(response.status).to eq(404)
      end
    end
  end
end
