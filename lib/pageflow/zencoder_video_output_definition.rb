module Pageflow
  class ZencoderVideoOutputDefinition < ZencoderOutputDefinition
    attr_reader :video_file

    def initialize(video_file, options = {})
      super(options)
      @video_file = video_file
    end

    def input_s3_url
      @video_file.attachment_s3_url
    end

    def outputs
      [
        s3_and_transfer(webm_high_definition),
        s3_and_transfer(webm_medium_definition),
        s3_and_transfer(mp4_high_definition),
        s3_and_transfer(mp4_medium_definition),
        s3_and_transfer(mp4_low_definition),
        s3_and_sftp(hls_high_definition),
        s3_and_sftp(hls_medium_definition),
        s3_and_sftp(hls_low_definition),
        s3_and_sftp(hls_playlist_definition),
        s3_and_sftp(smil_definition),
        thumbnails_definitions
      ].flatten
    end

    private

    def webm_high_definition
      {
        :label => 'webm_high',
        :format => 'webm',
        :path => video_file.webm_high.path,
        :size => '1280x720',
        :quality => 4,
        :max_video_bitrate => 3500,
        :public => 1,
        :sharpen => true
      }
    end

    def webm_medium_definition
      {
        :label => 'webm_medium',
        :format => 'webm',
        :path => video_file.webm_medium.path,
        :size => '1280x720',
        :quality => 3,
        :max_video_bitrate => 2000,
        :public => 1,
        :sharpen => true
      }
    end


    def mp4_high_definition
      {
        :label => 'high',
        :format => 'mp4',
        :path => video_file.mp4_high.path,
        :h264_level => 3.1,
        :max_frame_rate => 30,
        :max_video_bitrate => 3500,
        :audio_bitrate => 192,
        :h264_profile => 'main',
        :size => '1280x720',
        :public => 1,
        :forced_keyframe_rate => '0.5',
        :tuning => "film",
        :sharpen => true
      }
    end

    def mp4_medium_definition
      {
        :label => 'medium',
        :format => 'mp4',
        :path => video_file.mp4_medium.path,
        :h264_level => 3.1,
        :max_frame_rate => 30,
        :max_video_bitrate => 2000,
        :audio_bitrate => 128,
        :h264_profile => 'main',
        :size => '1280x720',
        :forced_keyframe_rate => '0.5',
        :public => 1,
        :sharpen => true
      }
    end

    def mp4_low_definition
      {
        :label => 'low',
        :format => 'mp4',
        :path => video_file.mp4_low.path,
        :device_profile => 'mobile/legacy',
        :audio_bitrate => 56,
        :forced_keyframe_rate => '0.5',
        :public => 1,
        :sharpen => true
      }
    end


    def hls_low_definition
      {
        :label => 'hls-low',
        :format => 'ts',
        :source => 'low',
        :copy_audio => 'true',
        :copy_video => 'true',
        :path => video_file.hls_low.path,
        :type => 'segmented',
        :public => 1
      }
    end

    def hls_medium_definition
      {
        :label => 'hls-medium',
        :format => 'ts',
        :source => 'medium',
        :copy_audio => 'true',
        :copy_video => 'true',
        :path => video_file.hls_medium.path,
        :type => 'segmented',
        :public => 1
      }
    end

    def hls_high_definition
      {
        :label => 'hls-high',
        :format => 'ts',
        :source => 'high',
        :copy_audio => 'true',
        :copy_video => 'true',
        :path => video_file.hls_high.path,
        :type => 'segmented',
        :public => 1
      }
    end

    def hls_playlist_definition
      {
        :label => 'hls-playlist',
        :streams => hls_stream_definitions,
        :type => 'playlist',
        :path => video_file.hls_playlist.path,
        :public => 1
      }
    end

    def hls_stream_definitions
      [
        {
          :path => video_file.hls_medium.url,
          :bandwidth => 2250
        },
        {
          :path => video_file.hls_low.url,
          :bandwidth => 256
        },
        {
          :path => video_file.hls_high.url,
          :bandwidth => 3750
        }
      ]
    end

    def smil_definition
      {
        :streams => smil_stream_definitions,
        :type => 'playlist',
        :format => 'highwinds',
        :path =>  video_file.smil.path,
        :public => true
      }
    end

    def smil_stream_definitions
      [
        {
          :path => video_file.mp4_medium.url(:host => :hls_origin),
          :bandwidth => 2250
        },
        {
          :path => video_file.mp4_low.url(:host => :hls_origin),
          :bandwidth => 256
        },
        {
          :path => video_file.mp4_high.url(:host => :hls_origin),
          :bandwidth => 3750
        }
      ]
    end

    def thumbnails_definitions
      result = [thumbnails_definition(method(:s3_url))]
      result << thumbnails_definition(method(:sftp_url)) if sftp_configured?
      result
    end

    def thumbnails_definition(url_helper)
      {
        :thumbnails => [
          {
            :label => 'poster',
            :format => video_file.zencoder_poster.format,
            :number => 1,
            :start_at_first_frame => true,
            :filename => video_file.zencoder_poster.base_name_pattern,
            :base_url => url_helper.call(video_file.zencoder_poster.dir_name),
            :public => 1
          },
          {
            :label => 'thumbnail',
            :format => video_file.zencoder_thumbnail.format,
            :number => 1,
            :filename => video_file.zencoder_thumbnail.base_name_pattern,
            :base_url => url_helper.call(video_file.zencoder_thumbnail.dir_name),
            :public => 1
          }
        ]
      }
    end
  end
end
