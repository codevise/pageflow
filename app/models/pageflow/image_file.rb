module Pageflow
  class ImageFile < ActiveRecord::Base
    include ImageFileStateMachine
    include UploadedFile

    STYLES = lambda do |attachment|
      panorama_format = File.extname(attachment.original_filename) == '.png' ? :PNG : :JPG

      Pageflow.config.thumbnail_styles
        .merge(print: ['300x300>', :JPG],
               medium: ['1024x1024>', :JPG],
               large: ['1920x1920>', :JPG],
               panorama_medium: ['1024x1024^', panorama_format],
               panorama_large: ['1920x1080^', panorama_format])
    end

    CONVERT_OPTIONS = {
      print: '-quality 10 -interlace Plane',
      medium: '-quality 70 -interlace Plane',
      large: '-quality 70 -interlace Plane',
      panorama_medium: '-quality 70 -interlace Plane',
      panorama_large: '-quality 70 -interlace Plane'
    }

    has_attached_file(:unprocessed_attachment,
                      Pageflow.config.paperclip_s3_default_options)

    has_attached_file(:processed_attachment,
                      Pageflow.config.paperclip_s3_default_options
                        .merge(default_url: ':pageflow_placeholder',
                               styles: STYLES,
                               convert_options: CONVERT_OPTIONS))

    do_not_validate_attachment_file_type(:unprocessed_attachment)
    do_not_validate_attachment_file_type(:processed_attachment)

    after_unprocessed_attachment_post_process :save_image_dimensions

    def attachment
      processed_attachment.present? ? processed_attachment : unprocessed_attachment
    end

    def attachment=(value)
      self.unprocessed_attachment = value
    end

    def thumbnail_url(*args)
      processed_attachment.url(*args)
    end

    def url
      if processed_attachment.present?
        attachment.url(:large)
      end
    end

    def original_url
      if processed_attachment.present?
        attachment.url
      end
    end

    def panorama_url
      if processed_attachment.present?
        attachment.url(:panorama_large)
      end
    end

    private

    def save_image_dimensions
      geo = Paperclip::Geometry.from_file(unprocessed_attachment.queued_for_write[:original])
      self.width = geo.width
      self.height = geo.height
    rescue Paperclip::Errors::NotIdentifiedByImageMagickError
    end
  end
end
