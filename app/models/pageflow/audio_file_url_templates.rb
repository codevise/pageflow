module Pageflow
  class AudioFileUrlTemplates
    def call
      {
        m4a: url_template(:m4a),
        mp3: url_template(:mp3),
        ogg: url_template(:ogg),
      }
    end

    private

    def url_template(attachment_name, *style)
      UrlTemplate.from_attachment(example_file.send(attachment_name), *style)
    end

    def example_file
      @example_file ||= AudioFile.new(id: 0, file_name: ':basename.mp3')
    end
  end
end
