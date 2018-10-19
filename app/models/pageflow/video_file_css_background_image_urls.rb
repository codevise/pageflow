module Pageflow
  # @api private
  class VideoFileCssBackgroundImageUrls
    def call(video_file)
      {
        default: {
          desktop: video_file.poster.url(:large),
          mobile: video_file.poster.url(:medium)
        }
      }
    end
  end
end
