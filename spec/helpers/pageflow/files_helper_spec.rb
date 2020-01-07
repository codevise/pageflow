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

    describe '#files_json_seed' do
      def render(helper, entry)
        helper.render_json do |json|
          helper.files_json_seed(json, entry)
        end
      end

      it 'renders ids of files' do
        entry = create(:published_entry)
        video_file = create(:video_file, used_in: entry.revision)

        result = render(helper, entry)

        expect(json_get(result, path: %w[video_files * id])).to eq([video_file.id])
      end

      it 'renders configurations of files' do
        entry = create(:published_entry)
        create(:video_file, used_in: entry.revision, with_configuration: {some: 'value'})

        result = render(helper, entry)
        value = json_get(result, path: ['video_files', 0, 'configuration', 'some'])

        expect(value).to eq('value')
      end

      it 'renders parent file info of files' do
        entry = create(:published_entry)
        video_file = create(:video_file, used_in: entry.revision)
        create(:text_track_file, used_in: entry.revision, parent_file: video_file)

        result = render(helper, entry)
        id = json_get(result, path: ['text_track_files', 0, 'parent_file_id'])
        type = json_get(result, path: ['text_track_files', 0, 'parent_file_model_type'])

        expect(id).to eq(video_file.id)
        expect(type).to eq(video_file.class.name)
      end

      it 'renders basenames of files' do
        entry = create(:published_entry)
        create(:video_file, used_in: entry.revision, file_name: 'some-video.mp4')

        result = render(helper, entry)
        value = json_get(result, path: ['video_files', 0, 'basename'])

        expect(value).to eq('some-video')
      end

      it 'renders file type partial, for example variant property for video file' do
        entry = create(:published_entry)
        create(:video_file, used_in: entry.revision, output_presences: {fullhd: true})

        result = render(helper, entry)
        variants = json_get(result, path: ['video_files', 0, 'variants'])

        expect(variants).to include('fullhd')
      end
    end
  end
end
