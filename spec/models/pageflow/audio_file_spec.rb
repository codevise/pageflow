require 'spec_helper'

module Pageflow
  describe AudioFile do
    include_examples 'media encoding state machine', :audio_file

    describe '#meta_data_attributes=' do
      it 'assigns format and duration_in_ms' do
        audio_file = build(:audio_file)

        audio_file.meta_data_attributes = {format: 'ogg', duration_in_ms: 1000}

        expect(audio_file.format).to eq('ogg')
        expect(audio_file.duration_in_ms).to eq(1000)
      end
    end

    describe '#peaks_data', unstub_paperclip: true do
      it 'is generated from ogg file' do
        audio_file = build(:audio_file)

        audio_file.peak_data = fixture_ogg_file
        audio_file.save!

        expect(audio_file.peak_data.url).to match(/audio.json/)

        peak_data = JSON.parse(File.read(audio_file.peak_data.path))
        expect(peak_data['data']).to be_kind_of(Array)
      end

      it 'raises error if audiowaveform fails' do
        audio_file = build(:audio_file)

        expect {
          audio_file.peak_data = fixture_png_file
        }.to raise_error(/Can't generate json format output from png format input/)
      end

      def fixture_ogg_file
        File.open(Engine.root.join('spec', 'fixtures', 'audio.ogg'))
      end

      def fixture_png_file
        File.open(Engine.root.join('spec', 'fixtures', 'image.png'))
      end
    end
  end
end
