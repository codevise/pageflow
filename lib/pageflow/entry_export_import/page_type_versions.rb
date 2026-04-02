module Pageflow
  module EntryExportImport
    # @api private
    module PageTypeVersions
      extend self

      class IncompatibleVersionsError < StandardError; end

      def dump
        Pageflow.config.page_types.to_h do |page_type|
          [page_type.name, page_type.export_version]
        end
      end

      def verify_compatibility!(data)
        data.each do |page_type_name, export_version|
          page_type = Pageflow.config.page_types.find_by_name!(page_type_name)
          requirement = Gem::Requirement.new(page_type.import_version_requirement)

          next if requirement.satisfied_by?(Gem::Version.new(export_version))

          raise(IncompatibleVersionsError,
                "Export version #{export_version} of page type #{page_type_name}. " \
                "does not match #{requirement}")
        end
      end
    end
  end
end
