require 'spec_helper'

module Pageflow
  describe FilesHelper do
    describe '#file_format' do
      it 'returns the format' do
        audio_file = create(:audio_file, format: 'mp3')

        expect(helper.file_format(audio_file)).to eq('mp3')
      end

      it 'returns a default value when format is missing' do
        audio_file = create(:audio_file)

        expect(helper.file_format(audio_file)).to eq('-')
      end
    end

    describe '#file_dimensions' do
      it 'returns width and height when both present' do
        video_file = create(:video_file, width: 300, height: 200)

        expect(helper.file_dimensions(video_file)).to eq('300 x 200px')
      end

      it 'returns a default value when either is missing' do
        video_file = create(:video_file)

        expect(helper.file_dimensions(video_file)).to eq('-')
      end
    end

    describe '#file_duration' do
      it 'returns the duration in hours, minutes and seconds' do
        audio_file = create(:audio_file, duration_in_ms: 42_766)

        expect(helper.file_duration(audio_file)).to eq('00:00:42')
      end

      it 'returns a default value when duration_in_ms is missing' do
        audio_file = create(:audio_file)

        expect(helper.file_duration(audio_file)).to eq('-')
      end
    end

    describe '#files_json_seeds' do
      it 'has keys of all file types' do
        revision = create(:revision, :published)
        entry = create(:entry, published_revision: revision)
        published_entry = PublishedEntry.new(entry)

        files_seed = JSON.parse(helper.files_json_seeds(published_entry))

        expect(files_seed).to have_key('image_files')
        expect(files_seed).to have_key('video_files')
        expect(files_seed).to have_key('audio_files')
      end

      it 'seeds required data for an image file' do
        revision = create(:revision, :published)
        entry = create(:entry, published_revision: revision)
        published_entry = PublishedEntry.new(entry)
        image_file = create(:image_file)
        create(:file_usage, revision: revision, file: image_file)

        files_seed = JSON.parse(helper.files_json_seeds(published_entry))
        image_file_seed = files_seed['image_files'].first

        expect(image_file_seed).to have_key('id')
        expect(image_file_seed).to have_key('state')
        expect(image_file_seed).to have_key('rights')
        expect(image_file_seed).to have_key('usage_id')
        expect(image_file_seed).to have_key('retryable')
        expect(image_file_seed).to have_key('file_name')
        expect(image_file_seed).to have_key('width')
        expect(image_file_seed).to have_key('height')
        expect(image_file_seed).to have_key('panorama_url')
        expect(image_file_seed).to have_key('dimensions')
        expect(image_file_seed).to have_key('thumbnail_url')
        expect(image_file_seed).to have_key('link_thumbnail_url')
      end

      it 'seeds required data for a video file' do
        revision = create(:revision, :published)
        entry = create(:entry, published_revision: revision)
        published_entry = PublishedEntry.new(entry)
        video_file = create(:video_file)
        create(:file_usage, revision: revision, file: video_file)

        files_seed = JSON.parse(helper.files_json_seeds(published_entry))
        video_file_seed = files_seed['video_files'].first

        expect(video_file_seed).to have_key('id')
        expect(video_file_seed).to have_key('dimensions')
        expect(video_file_seed).to have_key('duration')
        expect(video_file_seed).to have_key('encoding_progress')
        expect(video_file_seed).to have_key('file_name')
        expect(video_file_seed).to have_key('format')
        expect(video_file_seed).to have_key('height')
        expect(video_file_seed).to have_key('link_thumbnail_url')
        expect(video_file_seed).to have_key('original_url')
        expect(video_file_seed).to have_key('retryable')
        expect(video_file_seed).to have_key('rights')
        expect(video_file_seed).to have_key('sources')
        expect(video_file_seed).to have_key('state')
        expect(video_file_seed).to have_key('thumbnail_url')
        expect(video_file_seed).to have_key('url')
        expect(video_file_seed).to have_key('usage_id')
        expect(video_file_seed).to have_key('width')
        expect(video_file_seed).to have_key('text_track_file')
      end

      it 'seeds required data for an audio file' do
        revision = create(:revision, :published)
        entry = create(:entry, published_revision: revision)
        published_entry = PublishedEntry.new(entry)
        audio_file = create(:audio_file)
        create(:file_usage, revision: revision, file: audio_file)

        files_seed = JSON.parse(helper.files_json_seeds(published_entry))
        audio_file_seed = files_seed['audio_files'].first

        expect(audio_file_seed).to have_key('id')
        expect(audio_file_seed).to have_key('duration')
        expect(audio_file_seed).to have_key('encoding_progress')
        expect(audio_file_seed).to have_key('file_name')
        expect(audio_file_seed).to have_key('format')
        expect(audio_file_seed).to have_key('original_url')
        expect(audio_file_seed).to have_key('retryable')
        expect(audio_file_seed).to have_key('rights')
        expect(audio_file_seed).to have_key('state')
        expect(audio_file_seed).to have_key('url')
        expect(audio_file_seed).to have_key('usage_id')
        expect(audio_file_seed).to have_key('nested_files')
      end

      it 'seeds required data for a nested text track file' do
        revision = create(:revision, :published)
        entry = create(:entry, published_revision: revision)
        published_entry = PublishedEntry.new(entry)
        audio_file = create(:audio_file)
        create(:file_usage, revision: revision, file: audio_file)
        create(:text_track_file, parent_file: audio_file, entry: audio_file.entry)

        files_seed = JSON.parse(helper.files_json_seeds(published_entry))
        text_track_file_seed = files_seed['audio_files']
                               .first['nested_files']['text_track_files'].first

        expect(text_track_file_seed).to have_key('id')
        expect(text_track_file_seed).to have_key('state')
        expect(text_track_file_seed).to have_key('rights')
        expect(text_track_file_seed).to have_key('usage_id')
        expect(text_track_file_seed).to have_key('retryable')
        expect(text_track_file_seed).to have_key('file_name')
        expect(text_track_file_seed).to have_key('url')
        expect(text_track_file_seed).to have_key('original_url')
        expect(text_track_file_seed).to have_key('label')
        expect(text_track_file_seed).to have_key('kind')
        expect(text_track_file_seed).to have_key('srclang')
      end
    end
  end
end
