require 'spec_helper'

module Pageflow
  describe AudioFileUrlTemplates do
    it 'returns templates for encoded files' do
      result = AudioFileUrlTemplates.new.call

      expect(result[:mp3]).to include('pageflow/audio_files/:id_partition/audio.mp3')
    end

    it 'includes templates for peaks data' do
      result = AudioFileUrlTemplates.new.call

      expect(result[:peak_data])
        .to include('pageflow/audio_files/peak_data/:id_partition/original/audio.json')
    end
  end
end
