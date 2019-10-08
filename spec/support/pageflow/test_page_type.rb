require 'pageflow/page_type'

module Pageflow
  class TestPageType < PageType
    attr_reader :name, :file_types, :revision_components

    def initialize(name:, file_types: [], revision_components: [])
      @name = name
      @file_types = file_types
      @revision_components = revision_components
    end
  end
end
