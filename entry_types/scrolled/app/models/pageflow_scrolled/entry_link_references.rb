module PageflowScrolled
  # Find signed links to other entries and their chapters and
  # sections in configurations.
  #
  # @api private
  class EntryLinkReferences
    def initialize(configurations)
      @configurations = configurations
    end

    def chapter_perma_ids_by_entry_id
      valid_links
        .group_by(&:entry_id)
        .transform_values { |links| links.filter_map(&:chapter).uniq }
    end

    private

    Link = Struct.new(:entry_id, :chapter, :section, :signature)

    def valid_links
      @valid_links ||= links.uniq.select do |link|
        EntryLinkSignature.valid?(link.entry_id,
                                  link.signature,
                                  chapter: link.chapter,
                                  section: link.section)
      end
    end

    def links
      @configurations.each_with_object([]) do |configuration, result|
        each_href(configuration) do |href|
          entry_id = to_id(href['entry'])
          next unless entry_id

          result << Link.new(entry_id,
                             to_id(href['chapter']),
                             to_id(href['section']),
                             href['signature'])
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
