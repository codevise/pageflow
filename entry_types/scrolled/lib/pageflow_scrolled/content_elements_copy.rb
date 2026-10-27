module PageflowScrolled
  # @api private
  class ContentElementsCopy
    def initialize(source_entry:, destination_entry:)
      @file_references_rewrite = FileReferencesRewrite.new(source_entry:, destination_entry:)
    end

    def perform(content_elements, section:)
      position = next_position(section)

      ActiveRecord::Base.transaction do
        content_elements.map.with_index do |content_element, index|
          copy_content_element(content_element, section:, position: position + index)
        end
      end
    end

    private

    def copy_content_element(content_element, section:, position:)
      content_element.duplicate do |record|
        record.section = section
        record.position = position
        record.configuration = foreground_configuration(
          @file_references_rewrite.content_element_configuration(
            content_element.type_name, content_element.configuration
          )
        )
      end
    end

    def foreground_configuration(configuration)
      return configuration unless configuration['position'] == 'backdrop'

      configuration.except('position')
    end

    def next_position(section)
      (section.content_elements.maximum(:position) || -1) + 1
    end
  end
end
