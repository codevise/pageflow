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
               site: site,
               published_revision_attributes: {
                 published_at: 3.days.ago
               })
        create(:entry,
               :published,
               title: 'Story Two',
               site: site,
               permalink_attributes: {
                 slug: 'custom-slug'
               },
               published_revision_attributes: {
                 published_at: 2.days.ago
               })

        request.env['HTTP_HOST'] = 'pageflow.example.com'
        get(:index, format: 'xml')

        expect(response.status).to eq(200)
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

      it 'filters out unpublished or password protected entries' do
        site = create(:site, cname: 'pageflow.example.com')
        create(:entry, site: site)
        create(:entry, :published_with_password, site: site)

        request.env['HTTP_HOST'] = 'pageflow.example.com'
        get(:index, format: 'xml')

        expect(response.body).not_to have_xpath('//url')
      end

      it 'responds with 404 for unknown site' do
        site = create(:site, cname: 'pageflow.example.com')
        create(:entry, :published, site: site)

        request.env['HTTP_HOST'] = 'unknown.example.com'
        get(:index, format: 'xml')

        expect(response.status).to eq(404)
      end

      it 'responds with 404 unless sitemap enabled for site' do
        site = create(:site,
                      cname: 'pageflow.example.com',
                      sitemap_enabled: false)
        create(:entry, :published, site: site)

        request.env['HTTP_HOST'] = 'pageflow.example.com'
        get(:index, format: 'xml')

        expect(response.status).to eq(404)
      end
    end
  end
end
