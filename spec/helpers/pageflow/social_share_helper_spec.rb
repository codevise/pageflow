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
        storyline = create(:storyline, revision: entry.published_revision)
        chapter = create(:chapter, storyline: storyline)
        page = create(:page, chapter: chapter, configuration: { text: 'Page Text' }, position: 1)
        create(:page, chapter: chapter, configuration: { text: 'Another Page Text' }, position: 2)
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
        storyline = create(:storyline, revision: entry.published_revision)
        chapter = create(:chapter, storyline: storyline)
        page = create(:page, chapter: chapter, configuration: { text: 'Page Text' })
        published_entry = PublishedEntry.new(entry)

        result = helper.social_share_page_description(page, published_entry)

        expect(result).to eq(page.configuration['text'])
      end

      it 'returns page description if present and page has no text' do
        entry = create(:entry, :published)
        storyline = create(:storyline, revision: entry.published_revision)
        chapter = create(:chapter, storyline: storyline)
        page = create(:page, chapter: chapter, configuration: { description: 'description' })
        published_entry = PublishedEntry.new(entry)

        result = helper.social_share_page_description(page, published_entry)

        expect(result).to eq(page.configuration['description'])
      end

      it 'returns result of social_share_entry_description if page has neither text nor description' do
        entry = create(:entry, :published)
        entry.published_revision.summary = 'social share description'
        storyline = create(:storyline, revision: entry.published_revision)
        chapter = create(:chapter, storyline: storyline)
        page = create(:page, chapter: chapter)
        published_entry = PublishedEntry.new(entry)

        result = helper.social_share_page_description(page, published_entry)

        expect(result).to eq('social share description')
      end
    end

    describe '#social_share_entry_image_tags', stub_paperclip: true do
      before :each do
        @entry = create(:entry, :published)
        @image1 = create(:image_file, :processed, entry: @entry)
        @image2 = create(:image_file, :processed, entry: @entry)
        @image3 = create(:image_file, :processed, entry: @entry)
      end

      it 'renders share image meta tags if share image was chosen' do
        @entry.published_revision.share_image_id = @image1.id
        published_entry = PublishedEntry.new(@entry)

        html = helper.social_share_entry_image_tags(published_entry)

        expect(html).to have_css("meta[content=\"#{@image1.thumbnail_url(:medium)}\"][property=\"og:image\"]", visible: false, count: 1)
        expect(html).to have_css("meta[content=\"#{@image1.thumbnail_url(:medium)}\"][name=\"twitter:image:src\"]", visible: false, count: 1)
      end

      it 'renders up to three open graph image meta tags for page thumbnails' do
        published_entry = PublishedEntry.new(@entry)
        storyline = create(:storyline, revision: @entry.published_revision)
        chapter = create(:chapter, storyline: storyline)
        create(:page, configuration: { thumbnail_image_id: @image1.id }, chapter: chapter)
        create(:page, configuration: { thumbnail_image_id: @image2.id }, chapter: chapter)
        create(:page, configuration: { thumbnail_image_id: @image3.id }, chapter: chapter)

        html = helper.social_share_entry_image_tags(published_entry)

        expect(html).to have_css("meta[content=\"#{@image1.thumbnail_url(:medium)}\"][property=\"og:image\"]", visible: false, count: 1)
        expect(html).to have_css("meta[content=\"#{@image2.thumbnail_url(:medium)}\"][property=\"og:image\"]", visible: false, count: 1)
        expect(html).to have_css("meta[content=\"#{@image3.thumbnail_url(:medium)}\"][property=\"og:image\"]", visible: false, count: 1)
        expect(html).to have_css('meta[property="og:image"]', visible: false, maximum: 3)
      end

      it 'renders one twitter image meta tag with first page thumbnail' do
        published_entry = PublishedEntry.new(@entry)
        storyline = create(:storyline, revision: @entry.published_revision)
        chapter = create(:chapter, storyline: storyline)
        create(:page, configuration: { thumbnail_image_id: @image1.id }, chapter: chapter)
        create(:page, configuration: { thumbnail_image_id: @image2.id }, chapter: chapter)

        html = helper.social_share_entry_image_tags(published_entry)

        expect(html).to have_css("meta[content=\"#{@image1.thumbnail_url(:medium)}\"][name=\"twitter:image:src\"]", visible: false)
        expect(html).to have_css('meta[name="twitter:image:src"]', visible: false, count: 1)
      end
    end
  end
end
