require 'pageflow/test_page_type'
require 'pageflow/test_uploadable_file'
require 'pageflow/test_generated_file'

module Pageflow
  class TestFileType
    def self.register(config, model: 'Pageflow::TestUploadableFile', **)
      file_type = FileType.new(model:, **)
      page_type = TestPageType.new(name: :test,
                                   file_types: [file_type])

      config.page_types.register(page_type)
    end
  end
end
