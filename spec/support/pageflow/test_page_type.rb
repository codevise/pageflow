require 'pageflow/page_type'

module Pageflow
  class TestPageType < PageType
    attr_reader :name, :file_types

    def initialize(name:, file_types: [])
      @name = name
      @file_types = file_types
    end
  end
end
