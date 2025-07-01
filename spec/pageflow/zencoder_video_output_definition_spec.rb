require 'spec_helper'

module Pageflow
  describe ZencoderVideoOutputDefinition do
    describe '#outputs' do
      it 'contains all definitions except highdef per default' do
        video_file = build(:video_file)
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
        expect(definition).to have_output.to_s3(video_file.dash_playlist_high_and_up.path)
        expect(definition).to have_output.to_s3(video_file.hls_low.path)
        expect(definition).to have_output.to_s3(video_file.hls_medium.path)
        expect(definition).to have_output.to_s3(video_file.hls_high.path)
        expect(definition).not_to have_output.to_s3(video_file.hls_fullhd.path)
        expect(definition).not_to have_output.to_s3(video_file.hls_4k.path)
        expect(definition).to have_output.to_s3(video_file.hls_playlist.path)
        expect(definition).to have_output.to_s3(video_file.hls_playlist_high_and_up.path)
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
        expect(definition).to have_output.to_s3(video_file.dash_playlist_high_and_up.path)
        expect(definition).not_to have_output.to_s3(video_file.hls_low.path)
        expect(definition).not_to have_output.to_s3(video_file.hls_medium.path)
        expect(definition).not_to have_output.to_s3(video_file.hls_high.path)
        expect(definition).not_to have_output.to_s3(video_file.hls_fullhd.path)
        expect(definition).not_to have_output.to_s3(video_file.hls_4k.path)
        expect(definition).not_to have_output.to_s3(video_file.hls_playlist.path)
        expect(definition).not_to have_output.to_s3(video_file.hls_playlist_high_and_up.path)
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
        expect(definition).to have_output.to_s3(video_file.dash_playlist_high_and_up.path)
        expect(definition).to have_output.to_s3(video_file.hls_low.path)
        expect(definition).to have_output.to_s3(video_file.hls_medium.path)
        expect(definition).to have_output.to_s3(video_file.hls_high.path)
        expect(definition).not_to have_output.to_s3(video_file.hls_fullhd.path)
        expect(definition).not_to have_output.to_s3(video_file.hls_4k.path)
        expect(definition).to have_output.to_s3(video_file.hls_playlist.path)
        expect(definition).to have_output.to_s3(video_file.hls_playlist_high_and_up.path)
        expect(definition).not_to have_output.to_s3(video_file.smil.path)
      end

      it 'produces highdef outputs if set to do so' do
        video_file = build(:video_file, :with_highdef_encoding)
        definition = ZencoderVideoOutputDefinition.new(video_file)
        definition.skip_hls = false
        definition.skip_smil = false

        expect(definition).to have_output.to_s3(video_file.mp4_4k.path).with_min_size
        expect(definition).to have_output.to_s3(video_file.mp4_fullhd.path).with_min_size
        expect(definition).to have_output.to_s3(video_file.mp4_high.path)
        expect(definition).to have_output.to_s3(video_file.mp4_medium.path)
        expect(definition).to have_output.to_s3(video_file.mp4_low.path)
        expect(definition).to have_output.to_s3(video_file.dash_4k.path)
        expect(definition).to have_output.to_s3(video_file.dash_fullhd.path)
        expect(definition).to have_output.to_s3(video_file.dash_high.path)
        expect(definition).to have_output.to_s3(video_file.dash_medium.path)
        expect(definition).to have_output.to_s3(video_file.dash_low.path)
        expect(definition).to have_output.to_s3(video_file.dash_playlist.path)
        expect(definition).to have_output.to_s3(video_file.dash_playlist_high_and_up.path)
        expect(definition).to have_output.to_s3(video_file.hls_low.path)
        expect(definition).to have_output.to_s3(video_file.hls_medium.path)
        expect(definition).to have_output.to_s3(video_file.hls_high.path)
        expect(definition).to have_output.to_s3(video_file.hls_fullhd.path)
        expect(definition).to have_output.to_s3(video_file.hls_4k.path)
        expect(definition).to have_output.to_s3(video_file.hls_playlist.path)
        expect(definition).to have_output.to_s3(video_file.hls_playlist_high_and_up.path)
        expect(definition).to have_output.to_s3(video_file.smil.path)
      end

      it 'uses landscape sizes for landscape videos' do
        video_file = build(:video_file, :with_highdef_encoding, width: 1920, height: 1080)
        definition = ZencoderVideoOutputDefinition.new(video_file)

        expect(definition).to have_output.with_label('4k').with_size('3839x2160')
        expect(definition).to have_output.with_label('fullhd').with_size('1919x1080')
        expect(definition).to have_output.with_label('high').with_size('1280x720')
        expect(definition).to have_output.with_label('medium').with_size('853x480')
        expect(definition).to have_output.with_label('low').with_size('640x360')
      end

      it 'uses portrait sizes for protrait videos' do
        video_file = build(:video_file, :with_highdef_encoding, width: 1080, height: 1920)
        definition = ZencoderVideoOutputDefinition.new(video_file)

        expect(definition).to have_output.with_label('4k').with_size('2160x3839')
        expect(definition).to have_output.with_label('fullhd').with_size('1080x1919')
        expect(definition).to have_output.with_label('high').with_size('720x1280')
        expect(definition).to have_output.with_label('medium').with_size('480x853')
        expect(definition).to have_output.with_label('low').with_size('360x640')
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

      describe 'HLS playlists' do
        context 'without highdef encoding' do
          it 'includes only standard quality streams in main playlist' do
            video_file = build(:video_file)
            definition = ZencoderVideoOutputDefinition.new(video_file)
            definition.skip_hls = false

            expect(definition).to have_output
              .with_label('hls-playlist')
              .with_stream(source: 'hls-medium', bandwidth: 1769)
              .with_stream(source: 'hls-low', bandwidth: 619)
              .with_stream(source: 'hls-high', bandwidth: 3538)

            expect(definition).not_to have_output
              .with_label('hls-playlist')
              .with_stream(source: 'hls-fullhd')

            expect(definition).not_to have_output
              .with_label('hls-playlist')
              .with_stream(source: 'hls-4k')
          end

          it 'includes only high quality in high-and-up playlist' do
            video_file = build(:video_file)
            definition = ZencoderVideoOutputDefinition.new(video_file)
            definition.skip_hls = false

            expect(definition).to have_output
              .with_label('hls-playlist-high-and-up')
              .with_stream(source: 'hls-high', bandwidth: 3538)

            expect(definition).not_to have_output
              .with_label('hls-playlist-high-and-up')
              .with_stream(source: 'hls-fullhd')

            expect(definition).not_to have_output
              .with_label('hls-playlist-high-and-up')
              .with_stream(source: 'hls-4k')
          end
        end

        context 'with highdef encoding' do
          it 'includes all quality streams in main playlist' do
            video_file = build(:video_file, :with_highdef_encoding)
            definition = ZencoderVideoOutputDefinition.new(video_file)
            definition.skip_hls = false

            expect(definition).to have_output
              .with_label('hls-playlist')
              .with_stream(source: 'hls-medium', bandwidth: 1769)
              .with_stream(source: 'hls-low', bandwidth: 619)
              .with_stream(source: 'hls-high', bandwidth: 3538)
              .with_stream(source: 'hls-fullhd', bandwidth: 8575)
              .with_stream(source: 'hls-4k', bandwidth: 32_000)
          end

          it 'includes high and highdef streams in high-and-up playlist' do
            video_file = build(:video_file, :with_highdef_encoding)
            definition = ZencoderVideoOutputDefinition.new(video_file)
            definition.skip_hls = false

            expect(definition).to have_output
              .with_label('hls-playlist-high-and-up')
              .with_stream(source: 'hls-high', bandwidth: 3538)
              .with_stream(source: 'hls-fullhd', bandwidth: 8575)
              .with_stream(source: 'hls-4k', bandwidth: 32_000)
          end
        end
      end

      describe 'DASH playlists' do
        context 'without highdef encoding' do
          it 'includes only standard quality streams in main playlist' do
            video_file = build(:video_file)
            definition = ZencoderVideoOutputDefinition.new(video_file)

            expect(definition).to have_output
              .with_label('dash-playlist')
              .with_stream(source: 'dash-low')
              .with_stream(source: 'dash-medium')
              .with_stream(source: 'dash-high')

            expect(definition).not_to have_output
              .with_label('dash-playlist')
              .with_stream(source: 'dash-fullhd')

            expect(definition).not_to have_output
              .with_label('dash-playlist')
              .with_stream(source: 'dash-4k')
          end

          it 'includes only high quality in high-and-up playlist' do
            video_file = build(:video_file)
            definition = ZencoderVideoOutputDefinition.new(video_file)

            expect(definition).to have_output
              .with_label('dash-playlist-high-and-up')
              .with_stream(source: 'dash-high')

            expect(definition).not_to have_output
              .with_label('dash-playlist-high-and-up')
              .with_stream(source: 'dash-fullhd')

            expect(definition).not_to have_output
              .with_label('dash-playlist-high-and-up')
              .with_stream(source: 'dash-4k')
          end
        end

        context 'with highdef encoding' do
          it 'includes all quality streams in main playlist' do
            video_file = build(:video_file, :with_highdef_encoding)
            definition = ZencoderVideoOutputDefinition.new(video_file)

            expect(definition).to have_output
              .with_label('dash-playlist')
              .with_stream(source: 'dash-low')
              .with_stream(source: 'dash-medium')
              .with_stream(source: 'dash-high')
              .with_stream(source: 'dash-fullhd')
              .with_stream(source: 'dash-4k')
          end

          it 'includes high and highdef streams in high-and-up playlist' do
            video_file = build(:video_file, :with_highdef_encoding)
            definition = ZencoderVideoOutputDefinition.new(video_file)

            expect(definition).to have_output
              .with_label('dash-playlist-high-and-up')
              .with_stream(source: 'dash-high')
              .with_stream(source: 'dash-fullhd')
              .with_stream(source: 'dash-4k')
          end
        end
      end
    end
  end
end
