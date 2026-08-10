module PageflowScrolled
  # @api private
  class LottieFileUrlTemplates
    def call
      {
        original: Pageflow::UrlTemplate.from_attachment(example_file.attachment, :original)
      }
    end

    private

    def example_file
      @example_file ||= LottieFile.new(id: 0, file_name: ':basename.:extension')
    end
  end
end
