require 'pageflow/page_type'

module Pageflow
  class TestPageType < PageType
    attr_reader(:name,
                :file_types,
                :revision_components,
                :export_version)

    def initialize(name:,
                   file_types: [],
                   revision_components: [],
                   template_path: nil,
                   json_seed_template: nil,
                   thumbnail_candidates: nil,
                   export_version: '1.2.0',
                   import_version_requirement: nil)
      @name = name
      @file_types = file_types
      @revision_components = revision_components
      @template_path = template_path
      @json_seed_template = json_seed_template
      @thumbnail_candidates = thumbnail_candidates
      @export_version = export_version
      @import_version_requirement = import_version_requirement
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

    def import_version_requirement
      @import_version_requirement || super
    end
  end
end
