require 'spec_helper'

module Pageflow
  describe FileThumbnailsHelper do
    describe '#file_thumbnails_css' do
      it 'renders link thumbnail rule for image files of revision' do
        entry = create(:entry)
        image_file = create(:image_file, used_in: entry.draft)

        result = helper.file_thumbnails_css(entry.draft)

        expect(result).to include(".pageflow_image_file_link_thumbnail_#{image_file.id}")
      end

      it 'renders large link thumbnail rule for image files of revision' do
        entry = create(:entry)
        image_file = create(:image_file, used_in: entry.draft)

        result = helper.file_thumbnails_css(entry.draft)

        expect(result).to include(".pageflow_image_file_link_thumbnail_large_#{image_file.id}")
      end

      it 'renders link thumbnail rule for video files of revision' do
        entry = create(:entry)
        video_file = create(:video_file, used_in: entry.draft)

        result = helper.file_thumbnails_css(entry.draft)

        expect(result).to include(".pageflow_video_file_link_thumbnail_#{video_file.id}")
      end

      it 'skips file types that do not support thumbnails' do
        entry = create(:entry)
        audio_file = create(:audio_file, used_in: entry.draft)

        result = helper.file_thumbnails_css(entry.draft)

        expect(result).not_to include(".pageflow_audio_file_link_thumbnail_#{audio_file.id}")
      end
    end

    describe '#file_thumbnail_css_class' do
      it 'concats class name, style and id' do
        image_file = create(:image_file)

        result = helper.file_thumbnail_css_class(image_file, :thumbnail)

        expect(result).to eq("pageflow_image_file_thumbnail_#{image_file.id}")
      end

      it 'supportes positioned files' do
        image_file = create(:image_file)
        positioned_file = PositionedFile.new(image_file, 50, 50)

        result = helper.file_thumbnail_css_class(positioned_file, :thumbnail)

        expect(result).to eq("pageflow_image_file_thumbnail_#{image_file.id}")
      end
    end
  end
end
