module PageflowScrolled
  # Register additonal seed data for custom content elements and
  # widgets.
  class AdditionalSeedData
    # @api private
    def initialize
      @items = []
    end

    # Object passed to second parameter is expected to implement call
    # method taking an entry and a request object.
    def register(name, callable, content_element_type_names: nil)
      if @items.detect { |item| item.name == name }
        raise "Additional seed data with name '#{name}' already registered."
      end

      @items << Item.new(name, callable, content_element_type_names)
    end

    # @api private
    def for(entry, request, options = {})
      items_for_entry(entry, options).each_with_object({}) do |item, result|
        result[item.name] = item.callable.call(entry:, request:, foo: 1)
      end
    end

    private

    def items_for_entry(entry, options)
      items_for_content_element_types(
        ContentElement.select_used_type_names(
          entry.revision,
          content_element_type_names
        ),
        **options
      )
    end

    def items_for_content_element_types(type_names, include_unused: false)
      return @items if include_unused

      @items.select do |item|
        item.content_element_type_names.nil? ||
          (item.content_element_type_names & type_names).present?
      end
    end

    def content_element_type_names
      @items
        .flat_map(&:content_element_type_names)
        .uniq
    end

    # @api private
    Item = Struct.new(:name, :callable, :content_element_type_names)
  end
end
