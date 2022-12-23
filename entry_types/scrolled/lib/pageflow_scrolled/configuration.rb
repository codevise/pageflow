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
    # @since 15.7
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
    # @since 15.7
    attr_reader :additional_editor_packs

    # Provide additional seed data for custom widgets and content
    # elements.
    #
    # @example
    #
    #     config.additional_frontend_seed_data.register(
    #       pageflow-scrolled/contentElements/some-pack',
    #       ->(entry, request) { {some: 'data'}}
    #     )
    #
    # @return [AdditionalSeedData]
    # @since 15.7
    attr_reader :additional_frontend_seed_data

    def initialize(*)
      super
      @additional_frontend_packs = AdditionalPacks.new
      @additional_editor_packs = AdditionalPacks.new

      @additional_frontend_seed_data = AdditionalSeedData.new
    end
  end
end
