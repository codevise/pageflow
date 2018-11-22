module Pageflow
  class ImageFile < ApplicationRecord
    include HostedFile
    include ProcessedFileStateMachine

    def attachment_styles(attachment)
      panorama_format = File.extname(attachment.original_filename) == '.png' ? :PNG : :JPG

      Pageflow
        .config.thumbnail_styles
        .merge(
          print: {geometry: '300x300>',
                  format: :JPG,
                  convert_options: '-quality 10 -interlace Plane'},
          medium: {geometry: '1024x1024>',
                   format: :JPG,
                   convert_options: '-quality 70 -interlace Plane'},
          large: {geometry: '1920x1920>',
                  format: :JPG,
                  convert_options: '-quality 70 -interlace Plane'},
          ultra: {geometry: '3840x3840>',
                  format: :JPG,
                  convert_options: '-quality 90 -interlace Plane'},
          panorama_medium: {geometry: '1024x1024^',
                            format: panorama_format,
                            convert_options: '-quality 90 -interlace Plane'},
          panorama_large: {geometry: '1920x1080^',
                           format: panorama_format,
                           convert_options: '-quality 90 -interlace Plane'}
        )
    end

    def attachment_default_url
      ':pageflow_placeholder'
    end

    do_not_validate_attachment_file_type(:attachment_on_s3)

    after_attachment_on_s3_post_process :save_image_dimensions

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
