module PageflowScrolled
  # Configuration options for scrolled entry type
  class Configuration
    include Pageflow::EntryTypeConfiguration

    # Load additional Webpacker packs published entires and previews
    # when an entry contains content elements of a certain
    # type.
    #
    # @example
    #
    #     config.additional_frontend_packs.register(
    #       pageflow-scrolled/contentElements/some-pack',
    #       content_element_type_names: ['someType']
    #     )
    #
    # @return [AdditionalPacks]
    # @since edge
    attr_reader :additional_frontend_packs

    # Load additional Webpacker packs in editor.
    #
    # @example
    #
    #     config.additional_editor_packs.register(
    #       pageflow-scrolled/contentElements/some-pack'
    #     )
    #
    # @return [AdditionalPacks]
    # @since edge
    attr_reader :additional_editor_packs

    def initialize(*)
      super
      @additional_frontend_packs = AdditionalPacks.new
      @additional_editor_packs = AdditionalPacks.new
    end
  end
end
