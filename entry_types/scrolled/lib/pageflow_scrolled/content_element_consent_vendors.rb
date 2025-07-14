module PageflowScrolled
  # Register consent vendors based on content element configuration
  # data.
  class ContentElementConsentVendors
    # @api private
    def initialize
      @callables = {}
    end

    # Register callable to determine consent vendor from configuration
    # attributes for a content element type.
    #
    # @param callable [#call]
    #   Receives configuration keyword argument and returns
    # @param content_element_type_name [String]
    def register(callable, content_element_type_name:)
      @callables[content_element_type_name] = callable
    end

    # @api private
    def by_content_element_id(entry)
      content_elements_with_consent_vendor(entry).each_with_object({}) { |content_element, result|
        next unless @callables[content_element.type_name]

        result[content_element.id] = @callables[content_element.type_name].call(
          entry:,
          configuration: content_element.configuration
        )
      }.compact
    end

    private

    def content_elements_with_consent_vendor(entry)
      ContentElement.all_for_revision(entry.revision).where(type_name: @callables.keys)
    end
  end
end
