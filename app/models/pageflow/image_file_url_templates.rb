module Pageflow
  class ImageFileUrlTemplates
    def call
      styles.each_with_object({}) do |style, result|
        result[style] = UrlTemplate.from_attachment(example_file.attachment, style)
      end
    end

    private

    def styles
      example_file.attachment_styles(example_file.attachment).keys
    end

    def example_file
      @example_file ||= ImageFile.new(id: 0, file_name: ':basename.jpg')
    end
  end
end
