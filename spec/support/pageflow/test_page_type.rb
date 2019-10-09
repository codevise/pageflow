require 'pageflow/page_type'

module Pageflow
  class TestPageType < PageType
    attr_reader :name, :file_types, :revision_components

    def initialize(name:,
                   file_types: [],
                   revision_components: [],
                   template_path: nil,
                   json_seed_template: nil,
                   thumbnail_candidates: nil)
      @name = name
      @file_types = file_types
      @revision_components = revision_components
      @template_path = template_path
      @json_seed_template = json_seed_template
      @thumbnail_candidates = thumbnail_candidates
    end

    def template_path
      @template_path || super
    end

    def json_seed_template
      @json_seed_template || super
    end

    def thumbnail_candidates
      @thumbnail_candidates || super
    end
  end
end
