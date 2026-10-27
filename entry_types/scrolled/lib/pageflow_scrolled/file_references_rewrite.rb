module PageflowScrolled
  # @api private
  class FileReferencesRewrite
    def initialize(source_entry:, destination_entry:)
      @source_entry = source_entry
      @destination_entry = destination_entry
    end

    def section_configuration(configuration)
      rewrite(configuration, locations.section_locations)
    end

    def content_element_configuration(type_name, configuration)
      rewrite(configuration, locations.content_element_locations_for(type_name))
    end

    private

    def rewrite(configuration, reference_locations)
      rewrites = FileReferences.new(reference_locations.to_a)
                               .for(configuration)
                               .filter_map { |reference| rewrite_for(reference) }

      return configuration if rewrites.empty?

      configuration = configuration.deep_dup
      rewrites.each { |path, perma_id| write_at(configuration, path, perma_id) }
      configuration
    end

    def rewrite_for(reference)
      file_type = find_file_type(reference[:collection_name])
      return unless file_type

      file = @source_entry.find_file_by_perma_id(file_type.model, reference[:perma_id])
      return unless file

      [reference[:path], use_file(file, file_type)]
    end

    def use_file(file, file_type)
      usage = existing_usage(file) || create_usage(file, file_type)
      usage.file_perma_id
    end

    def create_usage(file, file_type)
      usage = @destination_entry.use_file(file)
      use_nested_files(file, file_type)
      usage
    end

    def use_nested_files(file, file_type)
      file_type.nested_file_types.each do |nested_file_type|
        nested_files_of(file, nested_file_type).each do |nested_file|
          @destination_entry.use_file(nested_file) unless existing_usage(nested_file)
        end
      end
    end

    def nested_files_of(file, nested_file_type)
      nested_file_type.model
                      .includes(:usages)
                      .references(:pageflow_file_usages)
                      .where(pageflow_file_usages: {revision_id: @source_entry.draft.id},
                             parent_file_id: file.id,
                             parent_file_model_type: file.model_name.name)
                      .map { |nested_file| Pageflow::UsedFile.new(nested_file) }
    end

    def existing_usage(file)
      @destination_entry.draft.file_usages.find_by(file: file.to_model)
    end

    def write_at(configuration, path, perma_id)
      *parent_path, key = path
      parent = parent_path.reduce(configuration) { |node, segment| node[segment] }
      parent[key] = perma_id
    end

    def find_file_type(collection_name)
      file_types.detect { |file_type| file_type.collection_name == collection_name.underscore }
    end

    def file_types
      @file_types ||= Pageflow.config_for(@source_entry).file_types
    end

    def locations
      @locations ||= EntryFileReferenceLocations.new(Pageflow.config_for(@source_entry))
    end
  end
end
