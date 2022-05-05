module Pageflow
  # @api private
  class ImageFileCssBackgroundImageUrls
    def call(image_file, entry:)
      {
        default: {
          desktop: image_file.ready? ? image_file.attachment.url(desktop_style(entry)) : '',
          mobile: image_file.ready? ? image_file.attachment.url(:medium) : ''
        },
        panorama: {
          desktop: image_file.ready? ? image_file.attachment.url(:panorama_large) : '',
          mobile: image_file.ready? ? image_file.attachment.url(:panorama_medium) : ''
        }
      }
    end

    private

    def desktop_style(entry)
      entry.feature_state('highdef_background_images') ? :ultra : :large
    end
  end
end
