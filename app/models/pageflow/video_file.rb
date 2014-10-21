module Pageflow
  class VideoFile < ActiveRecord::Base
    include HostedFile
    include EncodedFileStateMachine

    belongs_to :confirmed_by, :class_name => 'User'

    has_attached_file(:poster, Pageflow.config.paperclip_s3_default_options
                        .merge(:default_url => ':pageflow_placeholder',
                               :styles => {
                                 :thumbnail  => ["100x100#", :JPG],
                                 :navigation_thumbnail_small => ['85x47#', :JPG],
                                 :navigation_thumbnail_large => ['170x95#', :JPG],
                                 :thumbnail_overview_desktop => ['230x72#', :JPG],
                                 :thumbnail_overview_mobile => ['200x112#', :JPG],

                                 :link_thumbnail => ['192x108#', :JPG],
                                 :link_thumbnail_large => ['394x226#', :JPG],

                                 :medium => ['1920x1920>', :JPG],
                                 :large => ['1024x1024>', :JPG],
                                 :print => ['300x300>', :JPG]
                               },
                               :convert_options => {
                                 :medium => "-quality 90 -interlace Plane",
                                 :large => "-quality 90 -interlace Plane",
                                 :print => "-quality 10 -interlace Plane"
                               }))

    has_attached_file(:thumbnail, Pageflow.config.paperclip_s3_default_options
                        .merge(:default_url => ':pageflow_placeholder',
                               :default_style => :thumbnail,
                               :styles => {
                                 :thumbnail  => ["100x100#", :JPG],
                                 :navigation_thumbnail_small => ['85x47#', :JPG],
                                 :navigation_thumbnail_large => ['170x95#', :JPG],
                                 :thumbnail_overview_desktop => ['230x72#', :JPG],
                                 :thumbnail_overview_mobile => ['200x112#', :JPG],
                                 :medium => ['1920x1920>', :JPG],
                                 :large => ['1024x1024>', :JPG],
                               },
                               :convert_options => {
                                 :medium => "-quality 60 -interlace Plane",
                                 :large => "-quality 60 -interlace Plane"
                               }))

    def attachment_s3_url
      "s3://#{File.join(attachment_on_s3.bucket_name, attachment_on_s3.path)}"
    end


    def webm_high
      ZencoderAttachment.new(self, "high.webm")
    end

    def webm_medium
      ZencoderAttachment.new(self, "medium.webm")
    end


    def mp4_high
      ZencoderAttachment.new(self, "high.mp4")
    end

    def mp4_medium
      ZencoderAttachment.new(self, "medium.mp4")
    end

    def mp4_low
      ZencoderAttachment.new(self, "low.mp4")
    end


    def hls_low
      ZencoderAttachment.new(self, "hls-low.m3u8")
    end

    def hls_medium
      ZencoderAttachment.new(self, "hls-medium.m3u8")
    end

    def hls_high
      ZencoderAttachment.new(self, "hls-high.m3u8")
    end



    def hls_playlist
      if Pageflow.config.zencoder_options[:hls_smil_suffix].present?
        ZencoderAttachment.new(self, "hls-playlist.smil", :host => :hls, :url_suffix => Pageflow.config.zencoder_options[:hls_smil_suffix])
      else
        ZencoderAttachment.new(self, "hls-playlist.m3u8", :host => :hls)
      end
    end

    def smil
      ZencoderAttachment.new(self, "hls-playlist.smil")
    end

    def zencoder_thumbnail
      ZencoderAttachment.new(self, "thumbnail-{{number}}", :format => 'jpg')
    end

    def zencoder_poster
      ZencoderAttachment.new(self, "poster-{{number}}", :format => 'jpg')
    end

    def output_definition
      ZencoderVideoOutputDefinition.new(self)
    end

    def meta_data_attributes=(attributes)
      self.attributes = attributes.symbolize_keys.slice(:format, :duration_in_ms, :width, :height)
    end
  end
end
