module PageflowScrolled
  # Find the files that active references in the configurations of an
  # entry point at, including files nested in those.
  #
  # @api private
  class ReferencedFiles
    def initialize(entry, sections:, content_elements:, locations:)
      @entry = entry
      @sections = sections
      @content_elements = content_elements
      @locations = locations
    end

    def include?(collection_name, perma_id)
      keys.include?(key(collection_name, perma_id))
    end

    private

    def keys
      @keys ||= begin
        keys = Set.new(referenced_keys)
        keys.merge(nested_keys(keys))
      end
    end

    def referenced_keys
      @referenced_keys ||= subjects.flat_map do |configuration, subject_locations|
        FileReferences.new(subject_locations.to_a)
                      .for(configuration)
                      .select { |reference| reference[:active] }
                      .map { |reference| key(reference[:collection_name], reference[:perma_id]) }
      end
    end

    def subjects
      [[{'shareImageId' => @entry.share_image_id}, @locations.entry_locations]] +
        @sections.map { |section| [section.configuration, @locations.section_locations] } +
        @content_elements.map do |content_element|
          [content_element.configuration,
           @locations.content_element_locations_for(content_element.type_name)]
        end
    end

    def nested_keys(parent_keys)
      file_types.reject { |file_type| file_type.nested_file_types.empty? }.flat_map do |file_type|
        parent_perma_ids = files_of(file_type).to_h { |file| [file.id, file.perma_id] }

        file_type.nested_file_types.flat_map do |nested_file_type|
          nested_files_of_referenced(file_type, nested_file_type, parent_perma_ids, parent_keys)
        end
      end
    end

    def nested_files_of_referenced(file_type, nested_file_type, parent_perma_ids, parent_keys)
      files_of(nested_file_type).filter_map do |nested_file|
        next unless nested_file.parent_file_model_type == file_type.model.name
        next unless parent_keys.include?(key(file_type.collection_name,
                                             parent_perma_ids[nested_file.parent_file_id]))

        key(nested_file_type.collection_name, nested_file.perma_id)
      end
    end

    def files_of(file_type)
      @files ||= {}
      @files[file_type.model] ||= @entry.find_files(file_type.model)
    end

    def file_types
      @file_types ||= Pageflow.config_for(@entry).file_types
    end

    def key(collection_name, perma_id)
      [collection_name.to_s.camelize(:lower), perma_id]
    end
  end
end
