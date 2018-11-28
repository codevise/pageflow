module Pageflow
  class TextTrackFileUrlTemplates
    def call
      {
        vtt: UrlTemplate.from_attachment(example_file.attachment, :vtt)
      }
    end

    private

    def example_file
      @example_file ||= TextTrackFile.new(id: 0, file_name: ':basename.vtt')
    end
  end
end
