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

    let(:video_file) do
      create :video_file, :on_filesystem
    end

    let(:id_partition) do
      ("%09d" % video_file.id).scan(/\d{3}/).join("/")
    end

    describe '#original_filename' do
      it 'defaults to file_name_pattern' do
        attachment = ZencoderAttachment.new(video_file, 'video.mp4')

        expect(attachment.original_filename).to eq('video.mp4')
      end

      it 'replaces {{number}} in with 0' do
        attachment = ZencoderAttachment.new(video_file, 'thumbnail-{{number}}.jpg')

        expect(attachment.original_filename).to eq('thumbnail-0.jpg')
      end

      it 'appends format option' do
        attachment = ZencoderAttachment.new(video_file, 'thumbnail', format: 'jpg')

        expect(attachment.original_filename).to eq('thumbnail.jpg')
      end

      it 'supports slashes in file name pattern' do
        attachment = ZencoderAttachment.new(video_file, 'dash/video.mp4')

        expect(attachment.original_filename).to eq('dash/video.mp4')
      end
    end

    describe '#path' do
      it 'uses paperclip for interpolation' do
        attachment = ZencoderAttachment.new(video_file, 'video.mp4')

        expect(attachment.path).to eq("/#{version}/test-host/pageflow/video_files/#{id_partition}/video.mp4")
      end

      it 'replaces {{number}} in with 0' do
        attachment = ZencoderAttachment.new(video_file, 'thumbnail-{{number}}.jpg')

        expect(attachment.path).to eq("/#{version}/test-host/pageflow/video_files/#{id_partition}/thumbnail-0.jpg")
      end

      it 'appends format option' do
        attachment = ZencoderAttachment.new(video_file, 'thumbnail', format: 'jpg')

        expect(attachment.path).to eq("/#{version}/test-host/pageflow/video_files/#{id_partition}/thumbnail.jpg")
      end

      it 'supports slashed in file name pattern' do
        attachment = ZencoderAttachment.new(video_file, 'dash/video.mp4')

        expect(attachment.path).to eq("/#{version}/test-host/pageflow/video_files/#{id_partition}/dash/video.mp4")
      end
    end

    describe '#url' do
      it 'uses s3_protocol and s3_host_alias from zencoder config' do
        attachment = ZencoderAttachment.new(video_file, 'video.mp4')

        expect(attachment.url).to eq("#{s3_protocol}://#{s3_host_alias}/#{version}/" \
                                     "test-host/pageflow/video_files/#{id_partition}/video.mp4")
      end

      it 'supports protocol relative urls' do
        Pageflow.config.zencoder_options[:s3_protocol] = ''
        attachment = ZencoderAttachment.new(video_file, 'video.mp4')

        expect(attachment.url).to eq("//#{s3_host_alias}/#{version}/" \
                                     "test-host/files/#{id_partition}/video.mp4")
      end

      it 'supports slashes file name pattern' do
        attachment = ZencoderAttachment.new(video_file, 'dash/video.mp4')

        expect(attachment.url).to eq("#{s3_protocol}://#{s3_host_alias}/#{version}/" \
                                     "test-host/pageflow/video_files/#{id_partition}/dash/video.mp4")
      end

      context 'with default_protocol options ' do
        it 'prepends protocol if url would be protocol relative' do
          Pageflow.config.zencoder_options[:s3_protocol] = ''
          attachment = ZencoderAttachment.new(video_file, 'video.mp4')

          result = attachment.url(default_protocol: 'http')

          expect(result).to eq("http://#{s3_host_alias}/#{version}/" \
                               "test-host/pageflow/video_files/#{id_partition}/video.mp4")
        end

        it 'does not alter relative urls' do
          Pageflow.config.zencoder_options[:s3_protocol] = ''
          attachment = ZencoderAttachment.new(video_file, 'video.mp4', url: ':filename')

          expect(attachment.url(default_protocol: 'http')).to eq('video.mp4')
        end

        it 'does not alter protocol if configured' do
          Pageflow.config.zencoder_options[:s3_protocol] = 'https'
          attachment = ZencoderAttachment.new(video_file, 'video.mp4')

          result = attachment.url(default_protocol: 'http')

          expect(result).to eq("https://#{s3_host_alias}/#{version}/" \
                               "test-host/pageflow/video_files/#{id_partition}/video.mp4")
        end
      end

      it 'can append unique id to url' do
        attachment = ZencoderAttachment.new(video_file, 'video.mp4')

        result = attachment.url(unique_id: 3)

        expect(result).to eq("#{s3_protocol}://#{s3_host_alias}/#{version}/" \
                             "test-host/pageflow/video_files/#{id_partition}/video.mp4?n=3")
      end

      it 'can append url suffix to url' do
        attachment = ZencoderAttachment.new(video_file, 'playlist.smil', url_suffix: '/master.m3u8')

        expect(attachment.url).to eq("#{s3_protocol}://#{s3_host_alias}/#{version}/" \
                                     "test-host/pageflow/video_files/#{id_partition}/playlist.smil/master.m3u8")
      end

      it 'can append url suffix and unique id to url' do
        attachment = ZencoderAttachment.new(video_file, 'playlist.smil', url_suffix: '/master.m3u8')

        result = attachment.url(unique_id: 3)

        expect(result).to eq("#{s3_protocol}://#{s3_host_alias}/#{version}/" \
                             "test-host/pageflow/video_files/#{id_partition}/playlist.smil/master.m3u8?n=3")
      end
    end

    describe '#url_relative_to' do
      it 'returns url which is relative to given other ZencoderAttachment' do
        manifest = ZencoderAttachment.new(video_file, 'manifest.mpd')
        attachment = ZencoderAttachment.new(video_file, 'high/rendition.mpd')

        result = attachment.url_relative_to(manifest)

        expect(result).to eq('high/rendition.mpd')
      end

      it 'handles common sub directory' do
        manifest = ZencoderAttachment.new(video_file, 'dash/manifest.mpd')
        attachment = ZencoderAttachment.new(video_file, 'dash/high/rendition.mpd')

        result = attachment.url_relative_to(manifest)

        expect(result).to eq('high/rendition.mpd')
      end

      it 'handles protocol relative urls correctly' do
        Pageflow.config.zencoder_options[:s3_protocol] = ''
        manifest = ZencoderAttachment.new(video_file, 'dash/manifest.mpd')
        attachment = ZencoderAttachment.new(video_file, 'dash/high/rendition.mpd')

        result = attachment.url_relative_to(manifest)

        expect(result).to eq('high/rendition.mpd')
      end

      it 'fails if other attachment is in other directory' do
        manifest = ZencoderAttachment.new(video_file, 'other/manifest.mpd')
        attachment = ZencoderAttachment.new(video_file, 'dash/high/rendition.mpd')

        expect {
          attachment.url_relative_to(manifest)
        }.to raise_error(/Could not generate relative url/)
      end
    end

    describe '#dir_name' do
      it 'returns directory path' do
        attachment = ZencoderAttachment.new(video_file, 'video.mp4')

        expect(attachment.dir_name).to eq("/#{version}/test-host/pageflow/video_files/#{id_partition}")
      end

      it 'includes dir components from file_name_pattern' do
        attachment = ZencoderAttachment.new(video_file, 'dir/video.mp4')

        expect(attachment.dir_name).to eq("/#{version}/test-host/pageflow/video_files/#{id_partition}/dir")
      end
    end

    describe '#base_name_pattern' do
      it 'removes dirs from pattern' do
        attachment = ZencoderAttachment.new(video_file, 'dir/video-{{number}}')

        expect(attachment.base_name_pattern).to eq('video-{{number}}')
      end
    end
  end
end
