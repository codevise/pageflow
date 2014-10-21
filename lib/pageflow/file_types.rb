module Pageflow
  class FileTypes
    include Enumerable

    def initialize(page_types)
      @page_types = page_types
    end

    def each(&block)
      @page_types.map(&:file_types).flatten.uniq(&:model).each(&block)
    end

    def find_by_collection_name!(collection_name)
      detect do |file_type|
        file_type.collection_name == collection_name
      end || raise(FileType::NotFoundError, "No file type found for collection name '#{collection_name}'.")
    end
  end
end
