require 'spec_helper'

module Pageflow
  describe ProcessImageOrTextTrackJob do
    it 'is enqueued on resizing queue by default' do
      entry = create(:entry)
      create_list(:image_file, 3, :processing, entry:)
      image_file = create(:image_file, :uploading, entry:)

      image_file.publish!

      expect(ProcessImageOrTextTrackJob).to have_been_enqueued.on_queue('resizing')
    end

    it 'is enqueued on bulk queue once entry has more processing files than threshold' do
      pageflow_configure do |config|
        config.bulk_file_processing_queue = :resizing_bulk
        config.bulk_file_processing_threshold = 2
      end
      entry = create(:entry)
      create_list(:image_file, 2, :processing, entry:)
      image_file = create(:image_file, :uploading, entry:)

      image_file.publish!

      expect(ProcessImageOrTextTrackJob).to have_been_enqueued.on_queue('resizing_bulk')
    end

    it 'stays on resizing queue while entry is within threshold' do
      pageflow_configure do |config|
        config.bulk_file_processing_queue = :resizing_bulk
        config.bulk_file_processing_threshold = 2
      end
      entry = create(:entry)
      create(:image_file, :processing, entry:)
      image_file = create(:image_file, :uploading, entry:)

      image_file.publish!

      expect(ProcessImageOrTextTrackJob).to have_been_enqueued.on_queue('resizing')
    end

    it 'ignores processing files of other entries' do
      pageflow_configure do |config|
        config.bulk_file_processing_queue = :resizing_bulk
        config.bulk_file_processing_threshold = 2
      end
      create_list(:image_file, 3, :processing)
      image_file = create(:image_file, :uploading)

      image_file.publish!

      expect(ProcessImageOrTextTrackJob).to have_been_enqueued.on_queue('resizing')
    end

    it 'counts processing files of same type only' do
      pageflow_configure do |config|
        config.bulk_file_processing_queue = :resizing_bulk
        config.bulk_file_processing_threshold = 2
      end
      entry = create(:entry)
      create_list(:image_file, 3, :processing, entry:)
      text_track_file = create(:text_track_file, :uploading, entry:)

      text_track_file.publish!

      expect(ProcessImageOrTextTrackJob).to have_been_enqueued.on_queue('resizing')
    end
  end
end
