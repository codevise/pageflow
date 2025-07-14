require 'spec_helper'

module Pageflow
  describe FileThumbnailsHelper do
    include UsedFileTestHelper

    describe '#file_thumbnails_css' do
      it 'renders link thumbnail rule for image files of revision' do
        entry = PublishedEntry.new(create(:entry, :published))
        image_file = create_used_file(:image_file, entry:)

        result = helper.file_thumbnails_css(entry)

        expect(result).to include(".pageflow_image_file_link_thumbnail_#{image_file.perma_id}")
      end

      it 'renders large link thumbnail rule for image files of revision' do
        entry = PublishedEntry.new(create(:entry, :published))
        image_file = create_used_file(:image_file, entry:)

        result = helper.file_thumbnails_css(entry)

        expect(result).to include(".pageflow_image_file_link_thumbnail_large_#{image_file.perma_id}")
      end

      it 'renders lazy loaded variants' do
        entry = PublishedEntry.new(create(:entry, :published))
        image_file = create_used_file(:image_file, entry:)

        result = helper.file_thumbnails_css(entry)

        expect(result).to include(".load_image.lazy_pageflow_image_file_link_thumbnail_#{image_file.perma_id}")
      end

      it 'renders link thumbnail rule for video files of revision' do
        entry = PublishedEntry.new(create(:entry, :published))
        video_file = create_used_file(:video_file, entry:)

        result = helper.file_thumbnails_css(entry)

        expect(result).to include(".pageflow_video_file_link_thumbnail_#{video_file.perma_id}")
      end

      it 'skips file types that do not support thumbnails' do
        entry = PublishedEntry.new(create(:entry, :published))
        audio_file = create_used_file(:audio_file, entry:)

        result = helper.file_thumbnails_css(entry)

        expect(result).not_to include(".pageflow_audio_file_link_thumbnail_#{audio_file.perma_id}")
      end
    end

    describe '#file_thumbnail_css_class' do
      it 'concats class name, style and id' do
        image_file = create_used_file(:image_file)

        result = helper.file_thumbnail_css_class(image_file, :thumbnail)

        expect(result).to eq("pageflow_image_file_thumbnail_#{image_file.perma_id}")
      end

      it 'supportes positioned files' do
        image_file = create_used_file(:image_file)
        positioned_file = PositionedFile.new(image_file, 50, 50)

        result = helper.file_thumbnail_css_class(positioned_file, :thumbnail)

        expect(result).to eq("pageflow_image_file_thumbnail_#{image_file.perma_id}")
      end
    end
  end
end
