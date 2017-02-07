module Pageflow
  class ZencoderVideoOutputDefinition < ZencoderOutputDefinition
    cattr_accessor :skip_hls, :skip_smil

    attr_reader :video_file

    MIN_SIZE_FOR_4K = '1921x1080'.freeze
    MIN_SIZE_FOR_FULLHD = '1281x720'.freeze

    def initialize(video_file, options = {})
      super(options)
      @video_file = video_file
    end

    def input_s3_url
      @video_file.attachment_s3_url
    end

    def outputs
      [
        mp4_highdef_definitions,
        transferable(mp4_high_definition),
        transferable(mp4_medium_definition),
        transferable(mp4_low_definition),

        dash_definitions,
        hls_definitions,
        smil_definitions,

        thumbnails_definitions
      ].flatten
    end

    private

    def mp4_highdef_definitions
      return [] unless video_file.entry.feature_state('highdef_video_encoding')
      [transferable(mp4_4k_definition), transferable(mp4_fullhd_definition)]
    end

    def mp4_4k_definition
      {
        label: '4k',
        prepare_for_segmenting: ['hls', 'dash'],
        path: video_file.mp4_4k.path,
        video_bitrate: 22000,
        decoder_bitrate_cap: 24420,
        decoder_buffer_size: 36631,
        audio_bitrate: 320,
        size: '3839x2160',
        skip: {
          min_size: MIN_SIZE_FOR_4K
        },
        public: 1,
      }
    end

    def mp4_fullhd_definition
      {
        label: 'fullhd',
        prepare_for_segmenting: ['hls', 'dash'],
        path: video_file.mp4_fullhd.path,
        video_bitrate: 6000,
        decoder_bitrate_cap: 6660,
        decoder_buffer_size: 9990,
        audio_bitrate: 192,
        size: '1919x1080',
        skip: {
          min_size: MIN_SIZE_FOR_FULLHD
        },
        public: 1,
      }
    end

    def mp4_high_definition
      {
        label: 'high',
        prepare_for_segmenting: ['hls', 'dash'],
        path: video_file.mp4_high.path,
        video_bitrate: 3072,
        decoder_bitrate_cap: 3410,
        decoder_buffer_size: 7326,
        audio_bitrate: 128,
        size: '1280x720',
        public: 1,
      }
    end

    def mp4_medium_definition
      {
        label: 'medium',
        prepare_for_segmenting: ['hls', 'dash'],
        path: video_file.mp4_medium.path,
        video_bitrate: 1536,
        decoder_bitrate_cap: 1705,
        decoder_buffer_size: 2557,
        audio_bitrate: 64,
        audio_channels: 1,
        size: '853x480',
        public: 1
      }
    end

    def mp4_low_definition
      {
        label: 'low',
        prepare_for_segmenting: ['hls', 'dash'],
        path: video_file.mp4_low.path,
        video_bitrate: 500,
        decoder_bitrate_cap: 555,
        decoder_buffer_size: 924,
        audio_bitrate: 64,
        audio_channels: 1,
        size: '640x360',
        public: 1,
        h264_profile: 'baseline'
      }
    end

    def dash_definitions
      dash_highdef_definitions +
        [
          non_transferable(dash_high_definition),
          non_transferable(dash_medium_definition),
          non_transferable(dash_low_definition),
          non_transferable(dash_playlist_definition)
        ]
    end

    def dash_highdef_definitions
      return [] unless video_file.entry.feature_state('highdef_video_encoding')

      [
        non_transferable(dash_fullhd_definition),
        non_transferable(dash_4k_definition)
      ]
    end

    def hls_definitions
      return [] if skip_hls

      hls_highdef_definitions +
        [
          non_transferable(hls_high_definition),
          non_transferable(hls_medium_definition),
          non_transferable(hls_low_definition),
          non_transferable(hls_playlist_definition)
        ]
    end

    def hls_highdef_definitions
      return [] unless video_file.entry.feature_state('highdef_video_encoding')

      [
        non_transferable(hls_fullhd_definition),
        non_transferable(hls_4k_definition)
      ]
    end

    def dash_low_definition
      {
        label: 'dash-low',
        source: 'low',
        copy_audio: 'true',
        copy_video: 'true',
        streaming_delivery_format: 'dash',
        streaming_delivery_profile: 'on_demand',
        path: video_file.dash_low.path,
        type: 'segmented',
        public: 1
      }
    end

    def dash_medium_definition
      {
        label: 'dash-medium',
        source: 'medium',
        copy_audio: 'true',
        copy_video: 'true',
        streaming_delivery_format: 'dash',
        streaming_delivery_profile: 'on_demand',
        path: video_file.dash_medium.path,
        type: 'segmented',
        public: 1
      }
    end

    def dash_high_definition
      {
        label: 'dash-high',
        source: 'high',
        copy_audio: 'true',
        copy_video: 'true',
        streaming_delivery_format: 'dash',
        streaming_delivery_profile: 'on_demand',
        path: video_file.dash_high.path,
        type: 'segmented',
        public: 1
      }
    end

    def dash_fullhd_definition
      {
        label: 'dash-fullhd',
        source: 'fullhd',
        copy_audio: 'true',
        copy_video: 'true',
        streaming_delivery_format: 'dash',
        streaming_delivery_profile: 'on_demand',
        path: video_file.dash_fullhd.path,
        type: 'segmented',
        public: 1
      }
    end

    def dash_4k_definition
      {
        label: 'dash-4k',
        source: '4k',
        copy_audio: 'true',
        copy_video: 'true',
        streaming_delivery_format: 'dash',
        streaming_delivery_profile: 'on_demand',
        path: video_file.dash_4k.path,
        type: 'segmented',
        public: 1
      }
    end

    def dash_playlist_definition
      {
        label: 'dash-playlist',
        streams: dash_stream_definitions,
        allow_skipped_sources: true,
        type: 'playlist',
        streaming_delivery_format: 'dash',
        path: video_file.dash_playlist.path,
        public: 1
      }
    end

    def dash_stream_definitions
      [
        {
          source: 'dash-low',
          path: video_file.dash_low.url
        },
        {
          source: 'dash-medium',
          path: video_file.dash_medium.url
        },
        {
          source: 'dash-high',
          path: video_file.dash_high.url
        }
      ] + dash_highdef_stream_definitions
    end

    def dash_highdef_stream_definitions
      return [] unless video_file.entry.feature_state('highdef_video_encoding')
      [
        {
          source: 'dash-fullhd',
          path: video_file.dash_fullhd.url
        },
        {
          source: 'dash-4k',
          path: video_file.dash_4k.url
        }
      ]
    end

    def hls_low_definition
      {
        label: 'hls-low',
        format: 'ts',
        source: 'low',
        copy_audio: 'true',
        copy_video: 'true',
        path: video_file.hls_low.path,
        type: 'segmented',
        public: 1
      }
    end

    def hls_medium_definition
      {
        label: 'hls-medium',
        format: 'ts',
        source: 'medium',
        copy_audio: 'true',
        copy_video: 'true',
        path: video_file.hls_medium.path,
        type: 'segmented',
        public: 1
      }
    end

    def hls_high_definition
      {
        label: 'hls-high',
        format: 'ts',
        source: 'high',
        copy_audio: 'true',
        copy_video: 'true',
        path: video_file.hls_high.path,
        type: 'segmented',
        public: 1
      }
    end

    def hls_fullhd_definition
      {
        label: 'hls-fullhd',
        format: 'ts',
        source: 'fullhd',
        copy_audio: 'true',
        copy_video: 'true',
        path: video_file.hls_fullhd.path,
        type: 'segmented',
        public: 1
      }
    end

    def hls_4k_definition
      {
        label: 'hls-4k',
        format: 'ts',
        source: '4k',
        copy_audio: 'true',
        copy_video: 'true',
        path: video_file.hls_4k.path,
        type: 'segmented',
        public: 1
      }
    end

    def hls_playlist_definition
      {
        label: 'hls-playlist',
        streams: hls_stream_definitions,
        allow_skipped_sources: true,
        type: 'playlist',
        path: video_file.hls_playlist.path,
        public: 1
      }
    end

    def hls_stream_definitions
      [
        {
          source: 'hls-medium',
          path: video_file.hls_medium.url(host: :hls_origin, default_protocol: 'http'),
          bandwidth: 1769
        },
        {
          source: 'hls-low',
          path: video_file.hls_low.url(host: :hls_origin, default_protocol: 'http'),
          bandwidth: 619
        },
        {
          source: 'hls-high',
          path: video_file.hls_high.url(host: :hls_origin, default_protocol: 'http'),
          bandwidth: 3538
        }
      ] + hls_highdef_stream_definitions
    end

    def hls_highdef_stream_definitions
      return [] unless video_file.entry.feature_state('highdef_video_encoding')
      [
        {
          source: 'hls-fullhd',
          path: video_file.hls_fullhd.url(host: :hls_origin, default_protocol: 'http'),
          bandwidth: 8575
        },
        {
          source: 'hls-4k',
          path: video_file.hls_4k.url(host: :hls_origin, default_protocol: 'http'),
          bandwidth: 32000
        }
      ]
    end

    def smil_definitions
      return [] if skip_smil

      smil_definition = {
        type: 'playlist',
        format: 'highwinds',
        path: video_file.smil.path,
        public: true
      }

      # EXPLANATION: Zencoder always includes all conditional outputs
      # in SMIL files even if they were skipped. To prevent generating
      # SMIL files which point to non existent files, we include three
      # definitions for the same file and apply the same conditions
      # that are used to decide whether outputs are skipped.
      #
      # Using the `min_size` values as `max_size` allows cases where
      # only one of the three SMIL outputs is skipped (i.e. if the
      # resolution is exactly equal to `MIN_SIZE_FULLHD`). Still, in
      # these cases the input file is just a tiny bit larger than the
      # next lower resolution, so we do not really care if the SMIL
      # file which does not include the higher quality does not win.
      if video_file.entry.feature_state('highdef_video_encoding')
        [
          non_transferable(smil_definition.merge(streams: smil_default_stream_definitions,
                                                 skip: {
                                                   max_size: MIN_SIZE_FOR_FULLHD
                                                 })),
          non_transferable(smil_definition.merge(streams: smil_fullhd_stream_definitions,
                                                 skip: {
                                                   min_size: MIN_SIZE_FOR_FULLHD,
                                                   max_size: MIN_SIZE_FOR_4K
                                                 })),
          non_transferable(smil_definition.merge(streams: smil_4k_stream_definitions,
                                                 skip: {
                                                   min_size: MIN_SIZE_FOR_4K
                                                 }))
        ]
      else
        non_transferable(smil_definition.merge(streams: smil_default_stream_definitions))
      end
    end

    def smil_default_stream_definitions
      [
        {
          path: video_file.mp4_medium.url(host: :hls_origin, default_protocol: 'http'),
          bandwidth: 1769
        },
        {
          path: video_file.mp4_low.url(host: :hls_origin, default_protocol: 'http'),
          bandwidth: 619
        },
        {
          path: video_file.mp4_high.url(host: :hls_origin, default_protocol: 'http'),
          bandwidth: 3538
        }
      ]
    end

    def smil_fullhd_stream_definitions
      [
        smil_default_stream_definitions,
        {
          path: video_file.mp4_fullhd.url(host: :hls_origin, default_protocol: 'http'),
          bandwidth: 8575
        }
      ].flatten
    end

    def smil_4k_stream_definitions
      [
        smil_fullhd_stream_definitions,
        {
          path: video_file.mp4_4k.url(host: :hls_origin, default_protocol: 'http'),
          bandwidth: 32000
        }
      ].flatten
    end

    def thumbnails_definitions
      if akamai_configured?
        result = [thumbnails_definition(method(:akamai_url))]
      else
        result = [thumbnails_definition(method(:s3_url))]
        result << thumbnails_definition(method(:sftp_url)) if sftp_configured?
      end
      result
    end

    def thumbnails_definition(url_helper)
      {
        thumbnails: [
          with_credentials(label: 'poster',
                           format: video_file.zencoder_poster.format,
                           number: 1,
                           start_at_first_frame: true,
                           filename: video_file.zencoder_poster.base_name_pattern,
                           base_url: url_helper.call(video_file.zencoder_poster.dir_name),
                           public: 1),
          with_credentials(label: 'thumbnail',
                           format: video_file.zencoder_thumbnail.format,
                           number: 1,
                           filename: video_file.zencoder_thumbnail.base_name_pattern,
                           base_url: url_helper.call(video_file.zencoder_thumbnail.dir_name),
                           public: 1)
        ]
      }
    end
  end
end
