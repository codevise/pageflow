require 'pageflow/test_page_type'

module Pageflow
  class TestFileType
    def self.register(config, options = {})
      file_type = FileType.new(model: 'Pageflow::TestUploadableFile', **options)

      page_type = TestPageType.new(name: :test,
                                   file_types: [file_type])

      config.page_types.register(page_type)
    end
  end
end
