module Pageflow
  class TextTrackFileUrlTemplates
    def call
      {
        vtt: UrlTemplate.from_attachment(example_file.attachment_on_s3, :vtt)
      }
    end

    private

    def example_file
      @example_file ||= TextTrackFile.new(id: 0,
                                          attachment_on_s3_file_name: ':basename.vtt')
    end
  end
end
