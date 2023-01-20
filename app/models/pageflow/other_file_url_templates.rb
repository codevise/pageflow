module Pageflow
  # @api private
  class OtherFileUrlTemplates
    def call
      {
        original: UrlTemplate.from_attachment(example_file.attachment, :original)
      }
    end

    private

    def example_file
      @example_file ||= OtherFile.new(id: 0, file_name: ':basename.:extension')
    end
  end
end
