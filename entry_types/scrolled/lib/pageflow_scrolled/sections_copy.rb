module PageflowScrolled
  # Copy sections from one entry into a chapter of another entry,
  # using the files their configurations reference in the destination
  # entry.
  #
  # @api private
  class SectionsCopy
    def initialize(source_entry:, destination_entry:)
      @source_entry = source_entry
      @destination_entry = destination_entry
    end

    def perform(sections, chapter:)
      position = next_position(chapter)

      ActiveRecord::Base.transaction do
        sections.map.with_index do |section, index|
          copy_section(section, chapter:, position: position + index)
        end
      end
    end

    private

    def copy_section(section, chapter:, position:)
      copy = section.duplicate do |record|
        record.chapter = chapter
        record.position = position
      end

      rewrite_file_references(copy, locations.section_locations)

      copy.content_elements.each do |content_element|
        rewrite_file_references(content_element,
                                content_element_locations[content_element.type_name])
      end

      copy
    end

    def rewrite_file_references(record, reference_locations)
      rewrites = FileReferences.new(reference_locations.to_a)
                               .for(record.configuration)
                               .filter_map { |reference| rewrite_for(reference) }

      return if rewrites.empty?

      configuration = record.configuration.deep_dup
      rewrites.each { |path, perma_id| write_at(configuration, path, perma_id) }
      record.update!(configuration:)
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

    def content_element_locations
      @content_element_locations ||= locations.content_element_locations
    end

    def locations
      @locations ||= EntryFileReferenceLocations.new(
        Pageflow.config_for(@source_entry), [], include_unused: true
      )
    end

    def next_position(chapter)
      (chapter.sections.maximum(:position) || -1) + 1
    end
  end
end
