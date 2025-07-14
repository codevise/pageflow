require 'spec_helper'

module Pageflow
  describe ZencoderAttachment do
    let(:zencoder_options) do
      Pageflow.config.zencoder_options
    end

    let(:s3_protocol) do
      zencoder_options[:s3_protocol]
    end

    let(:s3_host_alias) do
      zencoder_options[:s3_host_alias]
    end

    let(:version) do
      zencoder_options[:attachments_version]
    end

    def file_double(id:, output_presences: [])
      double('File',
             id:,
             class: double(name: 'File'),
             output_presences:)
    end

    describe '#original_filename' do
      it 'defaults to file_name_pattern' do
        attachment = ZencoderAttachment.new(file_double(id: 5), 'video.mp4')

        expect(attachment.original_filename).to eq('video.mp4')
      end

      it 'replaces {{number}} in with 0' do
        attachment = ZencoderAttachment.new(file_double(id: 5), 'thumbnail-{{number}}.jpg')

        expect(attachment.original_filename).to eq('thumbnail-0.jpg')
      end

      it 'appends format option' do
        attachment = ZencoderAttachment.new(file_double(id: 5), 'thumbnail', format: 'jpg')

        expect(attachment.original_filename).to eq('thumbnail.jpg')
      end

      it 'supports slashes in file name pattern' do
        attachment = ZencoderAttachment.new(file_double(id: 5), 'dash/video.mp4')

        expect(attachment.original_filename).to eq('dash/video.mp4')
      end
    end

    describe '#path' do
      it 'uses paperclip for interpolation' do
        file = file_double(id: 5)
        attachment = ZencoderAttachment.new(file, 'video.mp4')

        expect(attachment.path).to eq("/#{version}/test-host/files/000/000/005/video.mp4")
      end

      it 'replaces {{number}} in with 0' do
        file = file_double(id: 5)
        attachment = ZencoderAttachment.new(file, 'thumbnail-{{number}}.jpg')

        expect(attachment.path).to eq("/#{version}/test-host/files/000/000/005/thumbnail-0.jpg")
      end

      it 'appends format option' do
        file = file_double(id: 5)
        attachment = ZencoderAttachment.new(file, 'thumbnail', format: 'jpg')

        expect(attachment.path).to eq("/#{version}/test-host/files/000/000/005/thumbnail.jpg")
      end

      it 'supports slashed in file name pattern' do
        file = file_double(id: 5)
        attachment = ZencoderAttachment.new(file, 'dash/video.mp4')

        expect(attachment.path).to eq("/#{version}/test-host/files/000/000/005/dash/video.mp4")
      end
    end

    describe '#url' do
      it 'uses s3_protocol and s3_host_alias from zencoder config' do
        file = file_double(id: 5)
        attachment = ZencoderAttachment.new(file, 'video.mp4')

        expect(attachment.url).to eq("#{s3_protocol}://#{s3_host_alias}/#{version}/" \
                                     'test-host/files/000/000/005/video.mp4')
      end

      it 'supports protocol relative urls' do
        Pageflow.config.zencoder_options[:s3_protocol] = ''
        file = file_double(id: 5)
        attachment = ZencoderAttachment.new(file, 'video.mp4')

        expect(attachment.url).to eq("//#{s3_host_alias}/#{version}/" \
                                     'test-host/files/000/000/005/video.mp4')
      end

      it 'supports slashes file name pattern' do
        file = file_double(id: 5)
        attachment = ZencoderAttachment.new(file, 'dash/video.mp4')

        expect(attachment.url).to eq("#{s3_protocol}://#{s3_host_alias}/#{version}/" \
                                     'test-host/files/000/000/005/dash/video.mp4')
      end

      context 'with default_protocol options ' do
        it 'prepends protocol if url would be protocol relative' do
          Pageflow.config.zencoder_options[:s3_protocol] = ''
          file = file_double(id: 5)
          attachment = ZencoderAttachment.new(file, 'video.mp4')

          result = attachment.url(default_protocol: 'http')

          expect(result).to eq("http://#{s3_host_alias}/#{version}/" \
                               'test-host/files/000/000/005/video.mp4')
        end

        it 'does not alter relative urls' do
          Pageflow.config.zencoder_options[:s3_protocol] = ''
          file = file_double(id: 5)
          attachment = ZencoderAttachment.new(file, 'video.mp4', url: ':filename')

          expect(attachment.url(default_protocol: 'http')).to eq('video.mp4')
        end

        it 'does not alter protocol if configured' do
          Pageflow.config.zencoder_options[:s3_protocol] = 'https'
          file = file_double(id: 5)
          attachment = ZencoderAttachment.new(file, 'video.mp4')

          result = attachment.url(default_protocol: 'http')

          expect(result).to eq("https://#{s3_host_alias}/#{version}/" \
                               'test-host/files/000/000/005/video.mp4')
        end
      end

      it 'can append unique id to url' do
        file = file_double(id: 5)
        attachment = ZencoderAttachment.new(file, 'video.mp4')

        result = attachment.url(unique_id: 3)

        expect(result).to eq("#{s3_protocol}://#{s3_host_alias}/#{version}/" \
                             'test-host/files/000/000/005/video.mp4?n=3')
      end

      it 'can append url suffix to url' do
        file = file_double(id: 5)
        attachment = ZencoderAttachment.new(file, 'playlist.smil', url_suffix: '/master.m3u8')

        expect(attachment.url).to eq("#{s3_protocol}://#{s3_host_alias}/#{version}/" \
                                     'test-host/files/000/000/005/playlist.smil/master.m3u8')
      end

      it 'supports interpolations in file name pattern' do
        file = file_double(id: 5,
                           output_presences: {
                             'low' => true,
                             'medium' => true,
                             'high' => true,
                             'fullhd' => true,
                             '4k' => false,
                             'hls-playlist' => true
                           })
        attachment = ZencoderAttachment.new(file, ',:pageflow_hls_qualities,mp4.csmil',
                                            url_suffix: '/master.m3u8')

        expect(attachment.url)
          .to eq("#{s3_protocol}://#{s3_host_alias}/#{version}/" \
                 'test-host/files/000/000/005/,low,medium,high,fullhd,mp4.csmil/master.m3u8')
      end

      it 'can append url suffix and unique id to url' do
        file = file_double(id: 5)
        attachment = ZencoderAttachment.new(file, 'playlist.smil', url_suffix: '/master.m3u8')

        result = attachment.url(unique_id: 3)

        expect(result).to eq("#{s3_protocol}://#{s3_host_alias}/#{version}/" \
                             'test-host/files/000/000/005/playlist.smil/master.m3u8?n=3')
      end
    end

    describe '#relative_path_to' do
      it 'returns path which is relative to own path' do
        file = file_double(id: 5)
        manifest = ZencoderAttachment.new(file, 'manifest.mpd')
        attachment = ZencoderAttachment.new(file, 'high/rendition.mpd')

        result = manifest.relative_path_to(attachment.path)

        expect(result).to eq('high/rendition.mpd')
      end

      it 'handles common sub directory' do
        file = file_double(id: 5)
        manifest = ZencoderAttachment.new(file, 'dash/manifest.mpd')
        attachment = ZencoderAttachment.new(file, 'dash/high/rendition.mpd')

        result = manifest.relative_path_to(attachment.path)

        expect(result).to eq('high/rendition.mpd')
      end

      it 'fails if path is in other directory' do
        file = file_double(id: 5)
        manifest = ZencoderAttachment.new(file, 'other/manifest.mpd')
        attachment = ZencoderAttachment.new(file, 'dash/high/rendition.mpd')

        expect {
          manifest.relative_path_to(attachment.path)
        }.to raise_error(/Could not generate relative path/)
      end
    end

    describe '#dir_name' do
      it 'returns directory path' do
        file = file_double(id: 5)
        attachment = ZencoderAttachment.new(file, 'video.mp4')

        expect(attachment.dir_name).to eq("/#{version}/test-host/files/000/000/005")
      end

      it 'includes dir components from file_name_pattern' do
        file = file_double(id: 5)
        attachment = ZencoderAttachment.new(file, 'dir/video.mp4')

        expect(attachment.dir_name).to eq("/#{version}/test-host/files/000/000/005/dir")
      end
    end

    describe '#base_name_pattern' do
      it 'removes dirs from pattern' do
        file = file_double(id: 5)
        attachment = ZencoderAttachment.new(file, 'dir/video-{{number}}')

        expect(attachment.base_name_pattern).to eq('video-{{number}}')
      end
    end
  end
end
