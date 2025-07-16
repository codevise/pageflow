module PageflowScrolled
  # Register additonal Webpacker packs to be loaded in entries.
  class AdditionalPacks
    # @api private
    def initialize
      @packs = []
    end

    # content_element_type_names option only takes effect for frontend
    # packs.
    def register(path, content_element_type_names: [], stylesheet: false, if: nil, unless: nil)
      @packs << AdditionalPack.new(
        path,
        content_element_type_names,
        stylesheet,
        binding.local_variable_get(:if),
        binding.local_variable_get(:unless)
      )
    end

    # @api private
    def content_element_type_names
      @packs
        .flat_map(&:content_element_type_names)
        .uniq
    end

    # @api private
    def paths(entry)
      packs_matching_conditions(entry).map(&:path)
    end

    # @api private
    def stylesheet_paths(entry)
      packs_matching_conditions(entry).select(&:stylesheet).map(&:path)
    end

    # @api private
    def paths_for_content_element_types(entry, type_names)
      packs_matching_conditions(entry).reject { |pack|
        pack.content_element_type_names.present? &&
          !pack.content_element_type_names.intersect?(type_names)
      }.map(&:path)
    end

    # @api private
    AdditionalPack = Struct.new(:path, :content_element_type_names, :stylesheet, :if, :unless)

    private

    def packs_matching_conditions(entry)
      @packs
        .select { |pack| !pack.if || pack.if.call(entry:) }
        .select { |pack| !pack.unless || !pack.unless.call(entry:) }
    end
  end
end
