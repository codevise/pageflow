module Pageflow
  class ImageFile < ApplicationRecord
    include UploadableFile
    include ImageAndTextTrackProcessingStateMachine

    # used in paperclip initializer to interpolate the storage path
    # needs to be "processed_attachments" for images for legacy reasons
    def attachments_path_name
      'processed_attachments'
    end

    after_attachment_on_s3_post_process :save_image_dimensions

    def thumbnail_url(*args)
      unless ready?
        return Pageflow::PaperclipInterpolations::Support.pageflow_placeholder(attachment, *args)
      end
      attachment.url(*args)
    end

    def original_url
      attachment.url if ready?
    end

    def panorama_url
      attachment.url(:panorama_large) if ready?
    end

    # UploadableFile-overrides ->
    def attachment_default_url
      ':pageflow_placeholder'
    end

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

    def url
      attachment.url(:large) if ready?
    end
    # <- UploadableFile-overrides

    private

    def save_image_dimensions
      geo = Paperclip::Geometry.from_file(attachment.queued_for_write[:original])
      self.width = geo.width
      self.height = geo.height
    rescue Paperclip::Errors::NotIdentifiedByImageMagickError
    end
  end
end
