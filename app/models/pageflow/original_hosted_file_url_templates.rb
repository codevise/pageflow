module Pageflow
  class OriginalHostedFileUrlTemplates
    def initialize(options)
      @extension = options[:extension]
    end

    def call
      {
        original: UrlTemplate.from_attachment(example_file.attachment_on_s3)
      }
    end

    private

    def example_file
      @example_file ||= TextTrackFile.new(id: 0,
                                          attachment_on_s3_file_name: ":basename.#{@extension}")
    end
  end
end
