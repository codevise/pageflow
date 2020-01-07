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
  end
end
