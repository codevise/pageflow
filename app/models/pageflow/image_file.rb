module Pageflow
  class ImageFile < ApplicationRecord
    include ImageFileStateMachine
    include UploadedFile

    alias_attribute :file_name, :attachment_on_s3_file_name

    STYLES = lambda do |attachment|
      panorama_format = File.extname(attachment.original_filename) == '.png' ? :PNG : :JPG

      Pageflow
        .config.thumbnail_styles
        .merge(print: ['300x300>', :JPG],
               medium: ['1024x1024>', :JPG],
               large: ['1920x1920>', :JPG],
               ultra: ['3840x3840>', :JPG],
               panorama_medium: ['1024x1024^', panorama_format],
               panorama_large: ['1920x1080^', panorama_format])
    end

    CONVERT_OPTIONS = {
      print: '-quality 10 -interlace Plane',
      medium: '-quality 70 -interlace Plane',
      large: '-quality 70 -interlace Plane',
      ultra: '-quality 90 -interlace Plane',
      panorama_medium: '-quality 90 -interlace Plane',
      panorama_large: '-quality 90 -interlace Plane'
    }.freeze

    has_attached_file(:attachment_on_s3,
                      Pageflow.config.paperclip_s3_default_options
                        .merge(default_url: ':pageflow_placeholder',
                               styles: STYLES,
                               convert_options: CONVERT_OPTIONS))

    validates :attachment_on_s3, presence: true

    do_not_validate_attachment_file_type(:attachment_on_s3)

    after_attachment_on_s3_post_process :save_image_dimensions

    def attachment
      attachment_on_s3
    end

    def attachment=(value)
      self.attachment_on_s3 = value
    end

    def basename
      File.basename(attachment_on_s3.original_filename, '.*')
    end

    def thumbnail_url(*args)
      attachment_on_s3.url(*args)
    end

    def url
      attachment_on_s3.url(:large)
    end

    def original_url
      attachment_on_s3.url
    end

    def panorama_url
      attachment_on_s3.url(:panorama_large)
    end

    private

    def save_image_dimensions
      geo = Paperclip::Geometry.from_file(attachment_on_s3.queued_for_write[:original])
      self.width = geo.width
      self.height = geo.height
    rescue Paperclip::Errors::NotIdentifiedByImageMagickError
    end
  end
end
