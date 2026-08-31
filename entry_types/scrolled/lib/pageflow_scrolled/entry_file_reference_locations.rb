module PageflowScrolled
  # Describe the places where the configurations of an entry can
  # reference files.
  #
  # @api private
  class EntryFileReferenceLocations
    def initialize(entry_config, content_elements, include_unused: false)
      @entry_config = entry_config
      @content_elements = content_elements
      @include_unused = include_unused
    end

    def content_element_locations
      content_element_type_names.each_with_object({}) do |type_name, result|
        schema = schemas.find(model: 'contentElement', type_name:)
        next unless schema

        result[type_name] = locations.for(schema)
      end
    end

    private

    # Content elements of any type can be added in the editor without
    # reloading the seed.
    def content_element_type_names
      if @include_unused
        schemas.type_names(model: 'contentElement')
      else
        @content_elements.map(&:type_name).uniq
      end
    end

    def schemas
      @schemas ||= @entry_config.configuration_schemas
    end

    def locations
      @locations ||= FileReferenceLocations.new(schemas)
    end
  end
end
