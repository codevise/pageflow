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
          yield json if block_given?
          helper.files_json_seed(json, entry)
        end
      end

      it 'renders ids of files' do
        entry = create(:published_entry)
        video_file = create(:video_file, used_in: entry.revision)

        result = render(helper, entry)

        expect(result).to include_json(
          video_files: [
            {id: video_file.id}
          ]
        )
        expect(result).to include_json(
          video_files: have_attributes(size: 1)
        )
      end

      it 'renders configurations of files' do
        entry = create(:published_entry)
        create(:video_file, used_in: entry.revision, with_configuration: {some: 'value'})

        result = render(helper, entry)

        expect(result).to include_json(
          video_files: [
            {configuration: {some: 'value'}}
          ]
        )
      end

      it 'renders parent file info of files' do
        entry = create(:published_entry)
        video_file = create(:video_file, used_in: entry.revision)
        create(:text_track_file, used_in: entry.revision, parent_file: video_file)

        result = render(helper, entry)

        expect(result).to include_json(
          text_track_files: [
            {
              parent_file_id: video_file.id,
              parent_file_model_type: video_file.class.name
            }
          ]
        )
      end

      it 'renders basenames of files' do
        entry = create(:published_entry)
        create(:video_file, used_in: entry.revision, file_name: 'some-video.mp4')

        result = render(helper, entry)

        expect(result).to include_json(
          video_files: [
            {basename: 'some-video'}
          ]
        )
      end

      it 'renders extention of files' do
        entry = create(:published_entry)
        create(:video_file, used_in: entry.revision, file_name: 'some-video.mp4')

        result = render(helper, entry)

        expect(result).to include_json(
          video_files: [
            {extension: 'mp4'}
          ]
        )
      end

      it 'renders file type partial, for example variant property for video file' do
        entry = create(:published_entry)
        create(:video_file, used_in: entry.revision, output_presences: {fullhd: true})

        result = render(helper, entry)

        expect(result).to include_json(
          video_files: [
            {variants: a_collection_including('fullhd')}
          ]
        )
      end

      describe 'for audio files' do
        it 'includes default outputs in variants' do
          entry = create(:published_entry)
          create(:audio_file, used_in: entry.revision)

          result = render(helper, entry)

          expect(result).to include_json(
            audio_files: [
              {variants: a_collection_including('mp3', 'ogg', 'm4a')}
            ]
          )
        end

        it 'does not include peak data in variants by default' do
          entry = create(:published_entry)
          create(:audio_file, used_in: entry.revision)

          result = render(helper, entry)

          json = JSON.parse(result)

          expect(json['audio_files'].first['variants']).not_to include('peakData')
        end

        it 'includes peak data in variants if peak_data_file_name is present' do
          entry = create(:published_entry)
          create(:audio_file, used_in: entry.revision, peak_data_file_name: 'audio.json')

          result = render(helper, entry)

          expect(result).to include_json(
            audio_files: [
              {variants: a_collection_including('peak_data')}
            ]
          )
        end

        it 'applies key format to variants' do
          entry = create(:published_entry)
          create(:audio_file, used_in: entry.revision, peak_data_file_name: 'audio.json')

          result = render(helper, entry) { |json| json.key_format!(camelize: :lower) }

          expect(result).to include_json(
            audioFiles: [
              {variants: a_collection_including('peakData')}
            ]
          )
        end
      end

      describe 'for image files' do
        it 'includes JPG processed extension' do
          entry = create(:published_entry)
          create(:image_file, used_in: entry.revision)

          result = render(helper, entry)

          expect(result).to include_json(
            image_files: [
              {processed_extension: a_string_including('JPG')}
            ]
          )
        end

        it 'includes webp processed extension based based on output presence' do
          entry = create(:published_entry)
          create(:image_file, used_in: entry.revision, output_presences: {webp: true})

          result = render(helper, entry)

          expect(result).to include_json(
            image_files: [
              {processed_extension: a_string_including('webp')}
            ]
          )
        end
      end
    end
  end
end
