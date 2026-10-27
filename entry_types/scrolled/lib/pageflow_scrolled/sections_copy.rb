module PageflowScrolled
  # Copy sections from one entry into a chapter of another entry,
  # using the files their configurations reference in the destination
  # entry.
  #
  # @api private
  class SectionsCopy
    def initialize(source_entry:, destination_entry:)
      @file_references_rewrite = FileReferencesRewrite.new(source_entry:, destination_entry:)
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

      update_configuration(copy,
                           @file_references_rewrite.section_configuration(copy.configuration))

      copy.content_elements.each do |content_element|
        update_configuration(
          content_element,
          @file_references_rewrite.content_element_configuration(content_element.type_name,
                                                                 content_element.configuration)
        )
      end

      copy
    end

    def update_configuration(record, configuration)
      record.update!(configuration:) unless configuration.equal?(record.configuration)
    end

    def next_position(chapter)
      (chapter.sections.maximum(:position) || -1) + 1
    end
  end
end
