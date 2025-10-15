module Pageflow
  # Registry for structured data types that can be used in entries.
  class EntryStructuredDataTypes
    def initialize
      @types = {}
      @default_name = nil
    end

    # Register a structured data type for entries.
    #
    # @param name [Symbol] The name of the structured data type
    # @param callable [Proc] A lambda that receives a {PublishedEntry} and returns
    #   a hash of structured data properties including @type
    # @param options [Hash] Optional configuration
    # @option options [Boolean] :default (false) Set this type as the default
    #   when no structured_data_type_name is specified on the entry
    #
    # @example
    #   config.entry_structured_data_types.register(:video_object, lambda do |entry|
    #     {
    #       '@type' => 'VideoObject',
    #       videoSection: 'documentary'
    #     }
    #   end, default: true)
    def register(name, callable, options = {})
      @types[name.to_s] = callable
      @default_name = name.to_s if options[:default]
    end

    # @api private
    def names
      @types.keys
    end

    # @api private
    def for(entry)
      structured_data_type =
        @types[entry.structured_data_type_name] || @types[@default_name]

      structured_data_type ? structured_data_type.call(entry) : {}
    end
  end
end
