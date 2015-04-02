require 'spec_helper'

module Pageflow
  describe SocialShareHelper do
    describe '#social_share_entry_description' do
      it 'returns entry summary if present' do
        entry = create(:entry, :published)
        entry.published_revision.summary = 'social share description'
        published_entry = PublishedEntry.new(entry)

        result = helper.social_share_entry_description(published_entry)

        expect(result).to eq('social share description')
      end

      it 'returns html stripped text' do
        entry = create(:entry, :published)
        entry.published_revision.summary = 'social<br />share <b>description</b>'
        published_entry = PublishedEntry.new(entry)

        result = helper.social_share_entry_description(published_entry)

        expect(result).to eq('social share description')
      end

      it 'returns text of first page which has text' do
        entry = create(:entry, :published)
        chapter = create(:chapter, revision: entry.published_revision)
        page = create(:page, chapter: chapter, configuration: { text: 'Page Text' })
        create(:page, chapter: chapter, configuration: { text: 'Another Page Text' })
        published_entry = PublishedEntry.new(entry)

        result = helper.social_share_entry_description(published_entry)

        expect(result).to eq(page.configuration['text'])
      end

      it 'returns empty string if no text was found' do
        entry = create(:entry, :published)
        published_entry = PublishedEntry.new(entry)

        result = helper.social_share_entry_description(published_entry)

        expect(result).to eq('')
      end
    end

    describe '#social_share_page_description' do
      it 'returns page text if present' do
        entry = create(:entry, :published)
        chapter = create(:chapter, revision: entry.published_revision)
        page = create(:page, chapter: chapter, configuration: { text: 'Page Text' })
        published_entry = PublishedEntry.new(entry)

        result = helper.social_share_page_description(page, published_entry)

        expect(result).to eq(page.configuration['text'])
      end

      it 'returns page description if present and page has no text' do
        entry = create(:entry, :published)
        chapter = create(:chapter, revision: entry.published_revision)
        page = create(:page, chapter: chapter, configuration: { description: 'description' })
        published_entry = PublishedEntry.new(entry)

        result = helper.social_share_page_description(page, published_entry)

        expect(result).to eq(page.configuration['description'])
      end

      it 'returns result of social_share_entry_description if page has neither text nor description' do
        entry = create(:entry, :published)
        entry.published_revision.summary = 'social share description'
        page = create(:page, chapter: create(:chapter, revision: entry.published_revision))
        published_entry = PublishedEntry.new(entry)

        result = helper.social_share_page_description(page, published_entry)

        expect(result).to eq('social share description')
      end
    end
  end
end
