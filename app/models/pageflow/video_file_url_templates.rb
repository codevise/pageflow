module Pageflow
  class VideoFileUrlTemplates
    def call
      {
        high: url_template(:mp4_high),
        medium: url_template(:mp4_medium),
        fullhd: url_template(:mp4_fullhd),
        :'4k' => url_template(:mp4_4k),

        :'hls-playlist' => url_template(:hls_playlist),
        :'dash-playlist' => url_template(:dash_playlist),

        poster_medium: url_template(:poster, :medium),
        poster_large: url_template(:poster, :large),
        poster_ultra: url_template(:poster, :ultra),

        print: url_template(:poster, :print)
      }
    end

    private

    def url_template(attachment_name, *style)
      UrlTemplate.from_attachment(example_file.send(attachment_name), *style)
    end

    def example_file
      @example_file ||= VideoFile.new(id: 0).tap do |video_file|
        video_file.file_name = ':basename.mp4'
        video_file.poster_file_name = video_file.zencoder_poster.original_filename
      end
    end
  end
end
