module Pageflow
  class TextTrackFileUrlTemplates
    def call
      {
        vtt: UrlTemplate.from_attachment(example_file.processed_attachment, :vtt)
      }
    end

    private

    def example_file
      @example_file ||= TextTrackFile.new(id: 0,
                                          processed_attachment_file_name: ':basename.vtt')
    end
  end
end
