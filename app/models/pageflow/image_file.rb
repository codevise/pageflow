module Pageflow
  class ImageFile < ApplicationRecord
    include UploadableFile
    include ImageAndTextTrackProcessingStateMachine
    include OutputSource

    before_post_process :set_output_presences

    # used in paperclip initializer to interpolate the storage path
    # needs to be "processed_attachments" for images for legacy reasons
    def attachments_path_name
      'processed_attachments'
    end

    before_attachment_on_s3_post_process :save_image_dimensions

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
        .config.thumbnail_styles.transform_values { |options| options.merge(style_defaults) }
        .merge(
          print: {geometry: '300x300>',
                  **style_defaults,
                  convert_options: '-quality 10 -interlace Plane'},
          medium: {geometry: '1024x1024>',
                   **style_defaults,
                   convert_options: '-quality 70 -interlace Plane'},
          large: {geometry: '1920x1920>',
                  **style_defaults,
                  convert_options: '-quality 70 -interlace Plane'},
          ultra: {geometry: '3840x3840>',
                  **style_defaults,
                  convert_options: '-quality 90 -interlace Plane'},
          panorama_medium: {geometry: ImageFile.scale_down_to_cover(1024, 1024),
                            format: panorama_format,
                            convert_options: '-quality 90 -interlace Plane'},
          panorama_large: {geometry: ImageFile.scale_down_to_cover(1920, 1080),
                           format: panorama_format,
                           convert_options: '-quality 90 -interlace Plane'}
        )
        .merge(social_image_styles)
    end

    def url
      attachment.url(:large) if ready?
    end
    # <- UploadableFile-overrides

    def self.scale_down_to_cover(width, height)
      lambda do |image_file|
        if image_file.width.present? && image_file.height.present? &&
           (image_file.width <= width || image_file.height <= height)
          '100%'
        else
          "#{width}x#{height}^"
        end
      end
    end

    private

    def save_image_dimensions
      geo = Paperclip::Geometry.from_file(attachment.queued_for_write[:original])
      geo.auto_orient

      self.width = geo.width
      self.height = geo.height
    rescue Paperclip::Errors::NotIdentifiedByImageMagickError
    end

    def social_image_styles
      if output_present?(:social)
        {social: {geometry: '1024x1024>',
                  format: :jpg,
                  convert_options: '-quality 70 -interlace Plane'}}
      else
        {}
      end
    end

    def style_defaults
      if output_present?(:webp)
        {format: :webp, processors: [:pageflow_webp]}
      else
        {format: :JPG}
      end
    end

    def set_output_presences
      self.output_presences = {webp: true, social: true} if entry&.feature_state('webp_images')
    end
  end
end
