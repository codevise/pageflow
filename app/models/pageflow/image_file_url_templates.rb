module Pageflow
  class ImageFileUrlTemplates # rubocop:todo Style/Documentation
    def call
      styles.each_with_object({}) do |style, result|
        result[style] = replace_extension_with_placeholder(
          UrlTemplate.from_attachment(example_file.attachment, style)
        )
      end
    end

    private

    def replace_extension_with_placeholder(url)
      url.gsub(/.JPG$/, '.:processed_extension')
    end

    def styles
      example_file.attachment_styles(example_file.attachment).keys + [:original]
    end

    def example_file
      @example_file ||= ImageFile.new(id: 0, file_name: ':basename.:extension')
    end
  end
end
