module Pageflow
  class FileTypes
    include Enumerable

    def initialize(page_types)
      @page_types = page_types
    end

    def each(&block)
      first_level_file_types = @page_types.map(&:file_types).flatten
      lower_level_file_types = search_for_nested_file_types(first_level_file_types)
      (first_level_file_types + lower_level_file_types).uniq(&:model).each(&block)
    end

    def find_by_collection_name!(collection_name)
      detect do |file_type|
        file_type.collection_name == collection_name
      end || raise(FileType::NotFoundError,
                   "No file type found for collection name '#{collection_name}'.")
    end

    def find_by_model!(model)
      detect do |file_type|
        file_type.model == model
      end || raise(FileType::NotFoundError, "No file type found for '#{model.name}'.")
    end

    def with_thumbnail_support
      select do |file_type|
        file_type.model.instance_methods.include?(:thumbnail_url)
      end
    end

    private

    def search_for_nested_file_types(higher_level_file_types)
      higher_level_file_types.map { |file_type|
        file_type.nested_file_types +
          search_for_nested_file_types(file_type.nested_file_types)
      }.flatten
    end
  end
end
