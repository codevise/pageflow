require 'spec_helper'

module Pageflow
  describe ZencoderVideoOutputDefinition do
    describe '#outputs' do
      it 'contains all definitions except highdef per default' do
        video_file = create(:video_file)
        definition = ZencoderVideoOutputDefinition.new(video_file)
        definition.skip_hls = false
        definition.skip_smil = false

        expect(definition).not_to have_output.to_s3(video_file.mp4_4k.path)
        expect(definition).not_to have_output.to_s3(video_file.mp4_fullhd.path)
        expect(definition).to have_output.to_s3(video_file.mp4_high.path)
        expect(definition).to have_output.to_s3(video_file.mp4_medium.path)
        expect(definition).to have_output.to_s3(video_file.mp4_low.path)
        expect(definition).not_to have_output.to_s3(video_file.dash_4k.path)
        expect(definition).not_to have_output.to_s3(video_file.dash_fullhd.path)
        expect(definition).to have_output.to_s3(video_file.dash_high.path)
        expect(definition).to have_output.to_s3(video_file.dash_medium.path)
        expect(definition).to have_output.to_s3(video_file.dash_low.path)
        expect(definition).to have_output.to_s3(video_file.dash_playlist.path)
        expect(definition).to have_output.to_s3(video_file.hls_low.path)
        expect(definition).to have_output.to_s3(video_file.hls_medium.path)
        expect(definition).to have_output.to_s3(video_file.hls_high.path)
        expect(definition).not_to have_output.to_s3(video_file.hls_fullhd.path)
        expect(definition).not_to have_output.to_s3(video_file.hls_4k.path)
        expect(definition).to have_output.to_s3(video_file.hls_playlist.path)
        expect(definition).to have_output.to_s3(video_file.smil.path)
      end

      it 'skips hls definitions if set to do so' do
        video_file = build(:video_file)
        definition = ZencoderVideoOutputDefinition.new(video_file)
        definition.skip_hls = true
        definition.skip_smil = false

        expect(definition).not_to have_output.to_s3(video_file.mp4_4k.path)
        expect(definition).not_to have_output.to_s3(video_file.mp4_fullhd.path)
        expect(definition).to have_output.to_s3(video_file.mp4_high.path)
        expect(definition).to have_output.to_s3(video_file.mp4_medium.path)
        expect(definition).to have_output.to_s3(video_file.mp4_low.path)
        expect(definition).not_to have_output.to_s3(video_file.dash_4k.path)
        expect(definition).not_to have_output.to_s3(video_file.dash_fullhd.path)
        expect(definition).to have_output.to_s3(video_file.dash_high.path)
        expect(definition).to have_output.to_s3(video_file.dash_medium.path)
        expect(definition).to have_output.to_s3(video_file.dash_low.path)
        expect(definition).to have_output.to_s3(video_file.dash_playlist.path)
        expect(definition).not_to have_output.to_s3(video_file.hls_low.path)
        expect(definition).not_to have_output.to_s3(video_file.hls_medium.path)
        expect(definition).not_to have_output.to_s3(video_file.hls_high.path)
        expect(definition).not_to have_output.to_s3(video_file.hls_fullhd.path)
        expect(definition).not_to have_output.to_s3(video_file.hls_4k.path)
        expect(definition).not_to have_output.to_s3(video_file.hls_playlist.path)
        expect(definition).to have_output.to_s3(video_file.smil.path)
      end

      it 'skips smil definitions if set to do so' do
        video_file = build(:video_file)
        definition = ZencoderVideoOutputDefinition.new(video_file)
        definition.skip_hls = false
        definition.skip_smil = true

        expect(definition).not_to have_output.to_s3(video_file.mp4_4k.path)
        expect(definition).not_to have_output.to_s3(video_file.mp4_fullhd.path)
        expect(definition).to have_output.to_s3(video_file.mp4_high.path)
        expect(definition).to have_output.to_s3(video_file.mp4_medium.path)
        expect(definition).to have_output.to_s3(video_file.mp4_low.path)
        expect(definition).not_to have_output.to_s3(video_file.dash_4k.path)
        expect(definition).not_to have_output.to_s3(video_file.dash_fullhd.path)
        expect(definition).to have_output.to_s3(video_file.dash_high.path)
        expect(definition).to have_output.to_s3(video_file.dash_medium.path)
        expect(definition).to have_output.to_s3(video_file.dash_low.path)
        expect(definition).to have_output.to_s3(video_file.dash_playlist.path)
        expect(definition).to have_output.to_s3(video_file.hls_low.path)
        expect(definition).to have_output.to_s3(video_file.hls_medium.path)
        expect(definition).to have_output.to_s3(video_file.hls_high.path)
        expect(definition).not_to have_output.to_s3(video_file.hls_fullhd.path)
        expect(definition).not_to have_output.to_s3(video_file.hls_4k.path)
        expect(definition).to have_output.to_s3(video_file.hls_playlist.path)
        expect(definition).not_to have_output.to_s3(video_file.smil.path)
      end

      it 'produces highdef outputs if set to do so' do
        video_file = build(:video_file, :with_highdef_encoding)
        definition = ZencoderVideoOutputDefinition.new(video_file)
        definition.skip_hls = false
        definition.skip_smil = false

        expect(definition).to have_output.to_s3(video_file.mp4_4k.path)
        expect(definition).to have_output.to_s3(video_file.mp4_fullhd.path)
        expect(definition).to have_output.to_s3(video_file.mp4_high.path)
        expect(definition).to have_output.to_s3(video_file.mp4_medium.path)
        expect(definition).to have_output.to_s3(video_file.mp4_low.path)
        expect(definition).to have_output.to_s3(video_file.dash_4k.path)
        expect(definition).to have_output.to_s3(video_file.dash_fullhd.path)
        expect(definition).to have_output.to_s3(video_file.dash_high.path)
        expect(definition).to have_output.to_s3(video_file.dash_medium.path)
        expect(definition).to have_output.to_s3(video_file.dash_low.path)
        expect(definition).to have_output.to_s3(video_file.dash_playlist.path)
        expect(definition).to have_output.to_s3(video_file.hls_low.path)
        expect(definition).to have_output.to_s3(video_file.hls_medium.path)
        expect(definition).to have_output.to_s3(video_file.hls_high.path)
        expect(definition).to have_output.to_s3(video_file.hls_fullhd.path)
        expect(definition).to have_output.to_s3(video_file.hls_4k.path)
        expect(definition).to have_output.to_s3(video_file.hls_playlist.path)
        expect(definition).to have_output.to_s3(video_file.smil.path)
      end

      it 'uses relative urls in dash playlist' do
        video_file = build_stubbed(:video_file, :with_highdef_encoding)
        definition = ZencoderVideoOutputDefinition.new(video_file)

        expect(definition).to have_output
          .with_label('dash-playlist')
          .with_all_streams_having(path: a_relative_url)
      end

      it 'uses relative urls in hls playlist' do
        video_file = build_stubbed(:video_file, :with_highdef_encoding)
        definition = ZencoderVideoOutputDefinition.new(video_file)

        expect(definition).to have_output
          .with_label('hls-playlist')
          .with_all_streams_having(path: a_relative_url)
      end

      it 'uses absolute urls in smil playlist' do
        video_file = build_stubbed(:video_file, :with_highdef_encoding)
        definition = ZencoderVideoOutputDefinition.new(video_file)
        definition.skip_smil = false

        expect(definition).to have_output
          .with_format('highwinds')
          .with_all_streams_having(path: an_absolute_url)
      end
    end
  end
end
