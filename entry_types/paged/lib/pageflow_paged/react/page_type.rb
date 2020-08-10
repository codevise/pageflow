module PageflowPaged
  module React
    class PageType < Pageflow::PageType
      attr_reader :name, :component_name, :file_types

      def initialize(name, options)
        @name = name
        @thumbnail_candidates = options[:thumbnail_candidates]
        @translation_key_prefix = options[:translation_key_prefix]
        @file_types = options.fetch(:file_types, [])
        @export_version = options[:export_version]
        @import_version_requirement = options[:import_version_requirement]
      end

      def template_path
        'pageflow_paged/react/page'
      end

      def thumbnail_candidates
        @thumbnail_candidates || super
      end

      def translation_key_prefix
        @translation_key_prefix || super
      end

      def export_version
        @export_version || super
      end

      def import_version_requirement
        @import_version_requirement || super
      end
    end
  end
end
