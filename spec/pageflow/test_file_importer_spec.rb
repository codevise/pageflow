require 'spec_helper'
require 'pageflow/lint'

module Pageflow
  file_importer = TestFileImporter.new
  puts Pageflow::Lint.file_import(file_importer)
end
