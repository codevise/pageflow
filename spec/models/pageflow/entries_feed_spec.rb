require 'spec_helper'

module Pageflow
  describe EntriesFeed do
    it 'sorts entries by first publication date' do
      site = create(:site, cname: 'pageflow.example.com')
      create(:entry,
             :published,
             site: site,
             first_published_at: 10.days.ago,
             published_revision_attributes: {
               title: 'Story Two',
               locale: 'en'
             })
      create(:entry,
             :published,
             site: site,
             first_published_at: 1.month.ago,
             published_revision_attributes: {
               title: 'Story One',
               locale: 'en'
             })
      create(:entry,
             :published,
             site: site,
             first_published_at: 1.day.ago,
             published_revision_attributes: {
               title: 'Story Three',
               locale: 'en'
             })
      feed = EntriesFeed.for(site: site, locale: 'en')

      expect(
        feed.entries.map(&:title)
      ).to eq(['Story Three', 'Story Two', 'Story One'])
    end

    it 'uses most recent publicated date for updated at' do
      site = create(:site, cname: 'pageflow.example.com')
      create(:entry,
             :published,
             site: site,
             first_published_at: 10.days.ago,
             published_revision_attributes: {
               published_at: 2.days.ago,
               title: 'Story Two',
               locale: 'en'
             })
      create(:entry,
             :published,
             site: site,
             first_published_at: 1.month.ago,
             published_revision_attributes: {
               published_at: 1.month.ago,
               title: 'Story One',
               locale: 'en'
             })
      feed = EntriesFeed.for(site: site, locale: 'en')

      expect(feed.updated_at).to eq(2.days.ago)
    end
  end
end
