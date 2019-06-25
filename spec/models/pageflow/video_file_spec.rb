require 'spec_helper'

module Pageflow
  describe VideoFile do
    include_examples 'media encoding state machine', :video_file

    describe '#meta_data_attributes=' do
      it 'assigns format, duration_in_ms, width and height' do
        video_file = build(:video_file)

        video_file.meta_data_attributes = {format: 'mpeg4',
                                           duration_in_ms: 1000,
                                           width: 100,
                                           height: 70,
                                           output_presences: {avi: 'finished', gif: 'skipped'}}

        expect(video_file.format).to eq('mpeg4')
        expect(video_file.duration_in_ms).to eq(1000)
        expect(video_file.width).to eq(100)
        expect(video_file.height).to eq(70)
        expect(video_file.output_present?(:avi)).to be true
        expect(video_file.output_present?(:gif)).to be false
        expect(video_file.output_present?(:bnk)).to be nil
      end
    end

    describe '#present_outputs' do
      it 'does not include hls by default' do
        video_file = build(:video_file, output_presences: {})

        expect(video_file.present_outputs).not_to include(:'hls-playlist')
      end

      it 'includes hls if akamai is configured' do
        Pageflow.config.zencoder_options[:hls_smil_suffix] = '/master.m3u8'

        video_file = build(:video_file, output_presences: {})

        expect(video_file.present_outputs).to include(:'hls-playlist')
      end
    end

    describe '#encode_highdef?' do
      it 'returns false by default' do
        video_file = build(:video_file)

        expect(video_file.encode_highdef?).to eq(false)
      end

      it 'returns true if entry has highdef_video_encoding feature enabled' do
        video_file = build(:video_file, :with_highdef_encoding)

        expect(video_file.encode_highdef?).to eq(true)
      end
    end
  end
end
