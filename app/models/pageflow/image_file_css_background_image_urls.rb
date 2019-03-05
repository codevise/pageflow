module Pageflow
  # @api private
  class ImageFileCssBackgroundImageUrls
    def call(image_file)
      {
        default: {
          desktop: image_file.ready? ? image_file.attachment.url(:large) : '',
          mobile: image_file.ready? ? image_file.attachment.url(:medium) : ''
        },
        panorama: {
          desktop: image_file.ready? ? image_file.attachment.url(:panorama_large) : '',
          mobile: image_file.ready? ? image_file.attachment.url(:panorama_medium) : ''
        }
      }
    end
  end
end
