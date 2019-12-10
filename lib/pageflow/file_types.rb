module Pageflow
  class FileTypes
    include Enumerable

    def initialize
      @file_types = []
    end

    def register(file_type)
      @file_types << file_type
    end

    def clear
      @file_types = []
    end

    def each(&block)
      first_level_file_types = trigger_lazy_loading_of_file_types
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

    def with_css_background_image_support
      select do |file_type|
        file_type.css_background_image_urls.present?
      end
    end

    private

    def trigger_lazy_loading_of_file_types
      # To avoid dependency cycles due to autoloading for model
      # references that are passed into FileType.new in some plugins,
      # we allow registering as file types lambdas which resolve to a
      # page type's file types. After some deprecation period, we
      # could get rid of this and just set first_level_file_types to
      # @file_types here.
      @file_types.map { |file_type|
        file_type.respond_to?(:call) ? file_type.call : file_type
      }.flatten
    end

    def search_for_nested_file_types(higher_level_file_types)
      higher_level_file_types.map { |file_type|
        file_type.nested_file_types +
          search_for_nested_file_types(file_type.nested_file_types)
      }.flatten
    end
  end
end
