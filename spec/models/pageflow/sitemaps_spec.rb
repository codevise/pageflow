require 'spec_helper'

module Pageflow
  describe Sitemaps do
    describe '#entries_for' do
      it 'sorts published entries by first publication date' do
        site = create(:site)
        create(:entry,
               :published,
               site:,
               first_published_at: 10.days.ago,
               published_revision_attributes: {
                 title: 'Story Two'
               })
        create(:entry,
               :published,
               site:,
               first_published_at: 1.month.ago,
               published_revision_attributes: {
                 title: 'Story One'
               })
        create(:entry,
               :published,
               site:,
               first_published_at: 1.day.ago,
               published_revision_attributes: {
                 title: 'Story Three'
               })
        create(:entry,
               :published_with_password,
               site:,
               first_published_at: 2.day.ago,
               published_revision_attributes: {
                 title: 'Secret'
               })

        expect(
          Sitemaps.entries_for(site:).map(&:title)
        ).to eq(['Story Three', 'Story Two', 'Story One'])
      end
    end
  end
end
