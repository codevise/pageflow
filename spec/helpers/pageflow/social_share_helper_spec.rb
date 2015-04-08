require 'spec_helper'

module Pageflow
  describe SocialShareHelper do
    before :each do
      @entry = create(:entry, :published)
      @image1 = create(:image_file, :processed, entry: @entry)
      @image2 = create(:image_file, :processed, entry: @entry)
      @image3 = create(:image_file, :processed, entry: @entry)
    end

    describe '#social_share_entry_image_tags', stub_paperclip: true do
      it 'renders share image meta tags if share image was chosen' do
        @entry.published_revision.share_image_id = @image1.id
        published_entry = PublishedEntry.new(@entry)

        html = helper.social_share_entry_image_tags(published_entry)

        expect(html).to have_css("meta[content=\"#{@image1.thumbnail_url(:medium)}\"][property=\"og:image\"]", visible: false, count: 1)
        expect(html).to have_css("meta[content=\"#{@image1.thumbnail_url(:medium)}\"][name=\"twitter:image:src\"]", visible: false, count: 1)
      end

      it 'renders up to three open graph image meta tags for page thumbnails' do
        published_entry = PublishedEntry.new(@entry)
        chapter = create(:chapter, revision: @entry.published_revision)
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
        chapter = create(:chapter, revision: @entry.published_revision)
        create(:page, configuration: { thumbnail_image_id: @image1.id }, chapter: chapter)
        create(:page, configuration: { thumbnail_image_id: @image2.id }, chapter: chapter)

        html = helper.social_share_entry_image_tags(published_entry)

        expect(html).to have_css("meta[content=\"#{@image1.thumbnail_url(:medium)}\"][name=\"twitter:image:src\"]", visible: false)
        expect(html).to have_css('meta[name="twitter:image:src"]', visible: false, count: 1)
      end
    end
  end
end
