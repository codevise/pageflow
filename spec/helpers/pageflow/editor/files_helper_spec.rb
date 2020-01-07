require 'spec_helper'

module Pageflow
  describe Editor::FilesHelper do
    describe '#editor_files_json_seeds' do
      it 'has keys for all built-in file types' do
        revision = create(:revision, :published)
        entry = create(:entry, published_revision: revision)
        published_entry = PublishedEntry.new(entry)

        files_seed = JSON.parse(helper.editor_files_json_seed(published_entry))

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

        files_seed = JSON.parse(helper.editor_files_json_seed(published_entry))
        video_file_seed = files_seed['video_files'].first

        expect(video_file_seed).to have_key('id')
        expect(video_file_seed).to have_key('perma_id')
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

        files_seed = JSON.parse(helper.editor_files_json_seed(published_entry))
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
        Pageflow.config.file_types.clear
        Pageflow.config.file_types.register(stub_file_type)

        entry = PublishedEntry.new(create(:entry, :published))
        create(:video_file, used_in: entry.revision)

        files_seed = JSON.parse(helper.editor_files_json_seed(entry))

        expect(files_seed['stub_files'].first).to have_key('test_property')
      end

      it 'renders file type partial' do
        stub_template('pageflow/stub_files/_stub_file.json.jbuilder' =>
                      'json.test_property "value"')
        stub_file_type = FileType.new(model: 'Pageflow::VideoFile',
                                      partial: 'pageflow/stub_files/stub_file',
                                      collection_name: 'stub_files',
                                      top_level_type: true)
        Pageflow.config.file_types.clear
        Pageflow.config.file_types.register(stub_file_type)

        entry = PublishedEntry.new(create(:entry, :published))
        create(:video_file, used_in: entry.revision)

        files_seed = JSON.parse(helper.editor_files_json_seed(entry))

        expect(files_seed['stub_files'].first).to have_key('test_property')
      end
    end
  end
end
