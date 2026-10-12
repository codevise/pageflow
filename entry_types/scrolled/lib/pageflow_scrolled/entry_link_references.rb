module PageflowScrolled
  # Find signed links to other entries in configurations.
  #
  # @api private
  class EntryLinkReferences
    def initialize(configurations)
      @configurations = configurations
    end

    def entry_ids
      signed_entry_ids
        .uniq
        .select { |entry_id, signature| EntryLinkSignature.valid?(entry_id, signature) }
        .map(&:first)
        .uniq
    end

    private

    def signed_entry_ids
      @configurations.each_with_object([]) do |configuration, result|
        each_href(configuration) do |href|
          entry_id = to_id(href['entry'])
          result << [entry_id, href['signature']] if entry_id
        end
      end
    end

    def each_href(value, &block)
      case value
      when Hash
        yield value['href'] if value['href'].is_a?(Hash)
        value.each_value { |item| each_href(item, &block) }
      when Array
        value.each { |item| each_href(item, &block) }
      end
    end

    def to_id(value)
      id = Integer(value, exception: false)
      id if id&.positive?
    end
  end
end
