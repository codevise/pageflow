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
      let(:page_type_class) do
        Class.new(PageType) do
          name 'test'

          def initialize(options)
            @file_types = options.fetch(:file_types)
          end

          attr_reader :file_types
        end
      end

      it 'has keys for all built-in file types' do
        revision = create(:revision, :published)
        entry = create(:entry, published_revision: revision)
        published_entry = PublishedEntry.new(entry)

        files_seed = JSON.parse(helper.files_json_seeds(published_entry))

        expect(files_seed).to have_key('image_files')
        expect(files_seed).to have_key('video_files')
        expect(files_seed).to have_key('audio_files')
      end

      it 'seeds required data, in this example for a video file' do
        revision = create(:revision, :published)
        entry = create(:entry, published_revision: revision)
        published_entry = PublishedEntry.new(entry)
        video_file = create(:video_file)
        create(:file_usage, revision: revision, file: video_file)

        files_seed = JSON.parse(helper.files_json_seeds(published_entry))
        video_file_seed = files_seed['video_files'].first

        expect(video_file_seed).to have_key('id')
        expect(video_file_seed).to have_key('file_name')
        expect(video_file_seed).to have_key('link_thumbnail_url')
        expect(video_file_seed).to have_key('original_url')
        expect(video_file_seed).to have_key('retryable')
        expect(video_file_seed).to have_key('rights')
        expect(video_file_seed).to have_key('state')
        expect(video_file_seed).to have_key('thumbnail_url')
        expect(video_file_seed).to have_key('url')
        expect(video_file_seed).to have_key('usage_id')
        expect(video_file_seed).to have_key('height')
      end

      it 'seeds required data, in this example for a nested text track file' do
        revision = create(:revision, :published)
        entry = create(:entry, published_revision: revision)
        published_entry = PublishedEntry.new(entry)
        video_file = create(:video_file, used_in: revision)
        create(:text_track_file, parent_file: video_file, used_in: revision)

        files_seed = JSON.parse(helper.files_json_seeds(published_entry))
        text_track_file_seed = files_seed['text_track_files'].first

        expect(text_track_file_seed).to have_key('id')
        expect(text_track_file_seed).to have_key('state')
        expect(text_track_file_seed).to have_key('rights')
        expect(text_track_file_seed).to have_key('usage_id')
        expect(text_track_file_seed).to have_key('retryable')
        expect(text_track_file_seed).to have_key('file_name')
        expect(text_track_file_seed).to have_key('url')
        expect(text_track_file_seed).to have_key('original_url')
        expect(text_track_file_seed).to have_key('parent_file_id')
        expect(text_track_file_seed).to have_key('parent_file_model_type')
      end

      it 'renders file type editor partial' do
        stub_template('pageflow/editor/stub_files/_stub_file.json.jbuilder' =>
                      'json.test_property "value"')
        stub_file_type = FileType.new(model: 'Pageflow::VideoFile',
                                      editor_partial: 'pageflow/editor/stub_files/stub_file',
                                      collection_name: 'stub_files',
                                      top_level_type: true)
        Pageflow.config.page_types.clear
        Pageflow.config.page_types.register(page_type_class.new(file_types: [stub_file_type]))

        entry = PublishedEntry.new(create(:entry, :published))
        create(:video_file, used_in: entry.revision)

        files_seed = JSON.parse(helper.files_json_seeds(entry))

        expect(files_seed['stub_files'].first).to have_key('test_property')
      end

      it 'renders file type partial' do
        stub_template('pageflow/stub_files/_stub_file.json.jbuilder' =>
                      'json.test_property "value"')
        stub_file_type = FileType.new(model: 'Pageflow::VideoFile',
                                      partial: 'pageflow/stub_files/stub_file',
                                      collection_name: 'stub_files',
                                      top_level_type: true)
        Pageflow.config.page_types.clear
        Pageflow.config.page_types.register(page_type_class.new(file_types: [stub_file_type]))

        entry = PublishedEntry.new(create(:entry, :published))
        create(:video_file, used_in: entry.revision)

        files_seed = JSON.parse(helper.files_json_seeds(entry))

        expect(files_seed['stub_files'].first).to have_key('test_property')
      end
    end
  end
end
