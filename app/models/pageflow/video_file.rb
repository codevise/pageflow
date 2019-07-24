module Pageflow
  class VideoFile < ApplicationRecord
    include UploadableFile
    include MediaEncodingStateMachine
    include OutputSource

    belongs_to :confirmed_by, class_name: 'User', optional: true

    has_attached_file(:poster, Pageflow.config.paperclip_s3_default_options
                        .merge(default_url: ':pageflow_placeholder',
                               styles: Pageflow.config.thumbnail_styles
                                 .merge(medium: ['1920x1920>', :JPG],
                                        large: ['1024x1024>', :JPG],
                                        ultra: ['3840x3840>', :JPG],
                                        print: ['300x300>', :JPG]),
                               convert_options: {
                                 medium: '-quality 90 -interlace Plane',
                                 large: '-quality 90 -interlace Plane',
                                 ultra: '-quality 90 -interlace Plane',
                                 print: '-quality 10 -interlace Plane'
                               }))

    has_attached_file(:thumbnail, Pageflow.config.paperclip_s3_default_options
                        .merge(:default_url => ':pageflow_placeholder',
                               :default_style => :thumbnail,
                               :styles => Pageflow.config.thumbnail_styles
                                 .merge(:medium => ['1920x1920>', :JPG],
                                        :large => ['1024x1024>', :JPG]),
                               :convert_options => {
                                 :medium => "-quality 60 -interlace Plane",
                                 :large => "-quality 60 -interlace Plane"
                               }))


    do_not_validate_attachment_file_type(:poster)
    do_not_validate_attachment_file_type(:thumbnail)

    def thumbnail_url(*args)
      poster.url(*args)
    end

    def attachment_s3_url
      "s3://#{File.join(attachment.bucket_name, attachment.path)}"
    end

    def encode_highdef?
      entry.feature_state('highdef_video_encoding')
    end

    def mp4_4k
      ZencoderAttachment.new(self, '4k.mp4')
    end

    def mp4_fullhd
      ZencoderAttachment.new(self, 'fullhd.mp4')
    end

    def mp4_high
      ZencoderAttachment.new(self, 'high.mp4')
    end

    def mp4_medium
      ZencoderAttachment.new(self, 'medium.mp4')
    end

    def mp4_low
      ZencoderAttachment.new(self, 'low.mp4')
    end

    def dash_4k
      ZencoderAttachment.new(self, 'dash/4k/rendition.mpd')
    end

    def dash_fullhd
      ZencoderAttachment.new(self, 'dash/fullhd/rendition.mpd')
    end

    def dash_high
      ZencoderAttachment.new(self, 'dash/high/rendition.mpd')
    end

    def dash_medium
      ZencoderAttachment.new(self, 'dash/medium/rendition.mpd')
    end

    def dash_low
      ZencoderAttachment.new(self, 'dash/low/rendition.mpd')
    end

    def hls_low
      ZencoderAttachment.new(self, 'hls-low.m3u8')
    end

    def hls_medium
      ZencoderAttachment.new(self, 'hls-medium.m3u8')
    end

    def hls_high
      ZencoderAttachment.new(self, 'hls-high.m3u8')
    end

    def hls_fullhd
      ZencoderAttachment.new(self, 'hls-fullhd.m3u8')
    end

    def hls_4k
      ZencoderAttachment.new(self, 'hls-4k.m3u8')
    end

    def dash_playlist
      ZencoderAttachment.new(self, 'dash/manifest.mpd')
    end

    def hls_playlist
      if Pageflow.config.zencoder_options[:hls_smil_suffix].present?
        ZencoderAttachment.new(self,
                               'hls-playlist.smil',
                               host: :hls,
                               url_suffix: Pageflow.config.zencoder_options[:hls_smil_suffix])
      else
        ZencoderAttachment.new(self, 'hls-playlist.m3u8', host: :hls)
      end
    end

    def smil
      ZencoderAttachment.new(self, 'hls-playlist.smil')
    end

    def zencoder_thumbnail
      ZencoderAttachment.new(self, 'thumbnail-{{number}}', format: 'jpg')
    end

    def zencoder_poster
      ZencoderAttachment.new(self, 'poster-{{number}}', format: 'jpg')
    end

    def output_definition
      ZencoderVideoOutputDefinition.new(self)
    end

    def externally_generated_outputs
      if Pageflow.config.zencoder_options[:hls_smil_suffix].present?
        %w(hls-playlist)
      else
        []
      end
    end

    def meta_data_attributes=(attributes)
      self.attributes = attributes.symbolize_keys.slice(:format,
                                                        :duration_in_ms,
                                                        :width,
                                                        :height,
                                                        :output_presences)
    end
  end
end
