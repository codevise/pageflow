module PageflowScrolled
  # Register additonal Webpacker packs to be loaded in entries.
  class AdditionalPacks
    # @api private
    def initialize
      @packs = []
    end

    # content_element_type_names option only takes effect for frontend
    # packs.
    def register(path, content_element_type_names: [])
      @packs << AdditionalPack.new(path, content_element_type_names)
    end

    # @api private
    def content_element_type_names
      @packs
        .flat_map(&:content_element_type_names)
        .uniq
    end

    # @api private
    def paths
      @packs.map(&:path)
    end

    # @api private
    def paths_for_content_element_types(type_names)
      @packs.reject { |pack|
        pack.content_element_type_names.present? &&
          (pack.content_element_type_names & type_names).empty?
      }.map(&:path)
    end

    # @api private
    AdditionalPack = Struct.new(:path, :content_element_type_names)
  end
end
