require 'spec_helper'

module Pageflow
  describe SocialShareHelper do
    describe '#social_share_entry_url' do
      it 'returns share_url if present' do
        entry = create(:entry, :published, published_revision_attributes: {
                         share_url: 'http://example.com/my_entry'
                       })
        published_entry = PublishedEntry.new(entry)

        result = helper.social_share_entry_url(published_entry)

        expect(result).to eq('http://example.com/my_entry')
      end

      it 'falls back to pretty entry url' do
        entry = create(:entry, :published, title: 'my_entry')
        published_entry = PublishedEntry.new(entry)

        result = helper.social_share_entry_url(published_entry)

        expect(result).to eq('http://test.host/my_entry')
      end
    end

    describe '#social_share_page_url' do
      it 'appends page param to pretty entry url' do
        entry = create(:entry, :published, title: 'my_entry')
        storyline = create(:storyline, revision: entry.published_revision)
        chapter = create(:chapter, storyline: storyline)
        page = create(:page, chapter: chapter, configuration: {text: 'Page Text'}, position: 1)
        published_entry = PublishedEntry.new(entry)

        result = helper.social_share_page_url(published_entry, page)

        expect(result).to eq("http://test.host/my_entry?page=#{page.perma_id}")
      end

      it 'supports string as page parameter' do
        entry = create(:entry, :published, title: 'my_entry')
        published_entry = PublishedEntry.new(entry)

        result = helper.social_share_page_url(published_entry, 'some_placeholder')

        expect(result).to eq('http://test.host/my_entry?page=some_placeholder')
      end
    end

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
        entry.published_revision.summary = 'social<br />share <b>description</b> &amp;&nbsp;more'
        published_entry = PublishedEntry.new(entry)

        result = helper.social_share_entry_description(published_entry)

        expect(result).to eq('social share description & more')
      end

      it 'returns text of first page which has text' do
        entry = create(:entry, :published)
        storyline = create(:storyline, revision: entry.published_revision)
        chapter = create(:chapter, storyline: storyline)
        page = create(:page, chapter: chapter, configuration: {text: 'Page Text'}, position: 1)
        create(:page, chapter: chapter, configuration: {text: 'Another Page Text'}, position: 2)
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
        page = create(:page, chapter: chapter, configuration: {text: 'Page Text'})
        published_entry = PublishedEntry.new(entry)

        result = helper.social_share_page_description(published_entry, page)

        expect(result).to eq(page.configuration['text'])
      end

      it 'returns page description if present and page has no text' do
        entry = create(:entry, :published)
        storyline = create(:storyline, revision: entry.published_revision)
        chapter = create(:chapter, storyline: storyline)
        page = create(:page, chapter: chapter, configuration: {description: 'description'})
        published_entry = PublishedEntry.new(entry)

        result = helper.social_share_page_description(published_entry, page)

        expect(result).to eq(page.configuration['description'])
      end

      it 'returns result of social_share_entry_description if page has neither text nor description' do
        entry = create(:entry, :published)
        entry.published_revision.summary = 'social share description'
        storyline = create(:storyline, revision: entry.published_revision)
        chapter = create(:chapter, storyline: storyline)
        page = create(:page, chapter: chapter)
        published_entry = PublishedEntry.new(entry)

        result = helper.social_share_page_description(published_entry, page)

        expect(result).to eq('social share description')
      end
    end

    describe '#social_share_entry_image_tags', stub_paperclip: true do
      include UsedFileTestHelper

      it 'renders share image meta tags if share image was chosen' do
        entry = PublishedEntry.new(create(:entry, :published))
        image_file = create_used_file(:image_file, entry: entry, width: 1200, height: 600)
        entry.revision.share_image_id = image_file.perma_id

        html = helper.social_share_entry_image_tags(entry)

        expect(html).to have_css("meta[content=\"#{image_file.thumbnail_url(:medium)}\"][property=\"og:image\"]", visible: false, count: 1)
        expect(html).to have_css("meta[content=\"#{image_file.width}\"][property=\"og:image:width\"]", visible: false, count: 1)
        expect(html).to have_css("meta[content=\"#{image_file.height}\"][property=\"og:image:height\"]", visible: false, count: 1)

        expect(html).to have_css("meta[content=\"#{image_file.thumbnail_url(:medium)}\"][name=\"twitter:image:src\"]", visible: false, count: 1)
      end

      it 'renders up to three open graph image meta tags for page thumbnails' do
        entry = PublishedEntry.new(create(:entry, :published))
        image_file1 = create_used_file(:image_file, entry: entry, width: 1200, height: 600)
        image_file2 = create_used_file(:image_file, entry: entry, width: 1200, height: 600)
        image_file3 = create_used_file(:image_file, entry: entry, width: 600, height: 300)
        storyline = create(:storyline, revision: entry.revision)
        chapter = create(:chapter, storyline: storyline)
        create(:page, configuration: {thumbnail_image_id: image_file1.perma_id}, chapter: chapter)
        create(:page, configuration: {thumbnail_image_id: image_file2.perma_id}, chapter: chapter)
        create(:page, configuration: {thumbnail_image_id: image_file3.perma_id}, chapter: chapter)

        html = helper.social_share_entry_image_tags(entry)

        expect(html).to have_css("meta[content=\"#{image_file1.thumbnail_url(:medium)}\"][property=\"og:image\"]", visible: false, count: 1)
        expect(html).to have_css("meta[content=\"#{image_file2.thumbnail_url(:medium)}\"][property=\"og:image\"]", visible: false, count: 1)
        expect(html).to have_css("meta[content=\"#{image_file3.thumbnail_url(:medium)}\"][property=\"og:image\"]", visible: false, count: 1)
        expect(html).to have_css("meta[content=\"#{image_file1.width}\"][property=\"og:image:width\"]", visible: false, count: 2)
        expect(html).to have_css("meta[content=\"#{image_file1.height}\"][property=\"og:image:height\"]", visible: false, count: 2)
        expect(html).to have_css("meta[content=\"#{image_file3.width}\"][property=\"og:image:width\"]", visible: false, count: 1)
        expect(html).to have_css("meta[content=\"#{image_file3.height}\"][property=\"og:image:height\"]", visible: false, count: 1)

        expect(html).to have_css('meta[property="og:image"]', visible: false, maximum: 3)
        expect(html).to have_css('meta[property="og:image:width"]', visible: false, maximum: 3)
        expect(html).to have_css('meta[property="og:image:height"]', visible: false, maximum: 3)
      end

      it 'renders one twitter image meta tag with first page thumbnail' do
        entry = PublishedEntry.new(create(:entry, :published))
        image_file1 = create_used_file(:image_file, entry: entry)
        image_file2 = create_used_file(:image_file, entry: entry)

        storyline = create(:storyline, revision: entry.revision)
        chapter = create(:chapter, storyline: storyline)
        create(:page, configuration: {thumbnail_image_id: image_file1.perma_id}, chapter: chapter)
        create(:page, configuration: {thumbnail_image_id: image_file2.perma_id}, chapter: chapter)

        html = helper.social_share_entry_image_tags(entry)

        expect(html).to have_css("meta[content=\"#{image_file1.thumbnail_url(:medium)}\"][name=\"twitter:image:src\"]", visible: false)
        expect(html).to have_css('meta[name="twitter:image:src"]', visible: false, count: 1)
      end

      it 'falls back to page thumbnails if share image references missing image' do
        entry = PublishedEntry.new(create(:entry, :published))
        image_file1 = create_used_file(:image_file, entry: entry)
        image_file2 = create_used_file(:image_file, entry: entry)
        storyline = create(:storyline, revision: entry.revision)
        chapter = create(:chapter, storyline: storyline)
        create(:page, configuration: {thumbnail_image_id: image_file2.perma_id}, chapter: chapter)

        entry.revision.share_image_id = image_file1.perma_id
        image_file1.destroy
        html = helper.social_share_entry_image_tags(entry)

        expect(html).to have_css(<<-END.strip, visible: false, count: 1)
          meta[content="#{image_file2.thumbnail_url(:medium)}"][property="og:image"]
        END
      end
    end
  end
end
