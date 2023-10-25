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

    # Determine which vendors a content element will require consent
    # for. Based on the vendor name returned here, the following
    # translations will be used in consent UI components.
    #
    #     pageflow_scrolled.consent_vendors.#{name}.name
    #     pageflow_scrolled.consent_vendors.#{name}.description
    #     pageflow_scrolled.consent_vendors.#{name}.opt_in_prompt
    #
    # @example
    #
    #     config.content_element_consent_vendors.register(
    #       lambda |configuration:| do
    #         if configuration['provider'] == 'youtube'
    #           'youtube'
    #         else
    #           'vimeo'
    #         end
    #       end,
    #       content_element_type_name: 'videoEmbed'
    #     )
    #
    # @return [ContentElementConsentVendors]
    # @since 16.1
    attr_reader :content_element_consent_vendors

    # Mapping from URL hosts to consent vendor names. Used for iframe
    # embed opt-in.
    #
    # @exmaple
    #
    #     entry_type_config.consent_vendor_host_matchers = {
    #       /\.some-vendor\.com$/ => 'someVendor'
    #     }
    #
    # @return [Hash<RegExp, String>]
    # @since 16.1
    attr_accessor :consent_vendor_host_matchers

    # Migrate typography variants to palette colors. Before palette
    # colors for text blocks and headings were introduced, it was
    # already possible to color text by defining typography variants
    # that only differ by text color. Now that color can be configured
    # independently, those typography variants have become
    # redundant. This option allows mapping each of those legacy
    # typography variants to a palette color and a different
    # typography variant that does not change color. Legacy typography
    # variants are not displayed in the editor typography variant list
    # box. When an element that uses a legacy typography variant is
    # selected in the editor, the typography variant and palette color
    # from the mapping can be shown as currently selected instead. To
    # make this work, the corresponding Backbome model needs to be
    # wrapped using Entry#createLegacyTypographyVariantDelegator.
    #
    # @example
    #
    #     config.themes.register(
    #       :custom,
    #       typography: {
    #         # Replaced by default variant and palette color
    #         'textBlock-paragraph-accent' => {
    #           color: 'var(--theme-accent-color)'
    #         },
    #         'textBlock-paragraph-lg' => {
    #           font_size: '28px',
    #         },
    #         # Replaced by lg variant and palette color
    #         'textBlock-paragraph-lgAccent' => {
    #           font_size: '28px',
    #           color: 'var(--theme-accent-color)'
    #         },
    #       },
    #       properties: {
    #         root: {
    #           accent_color: '#e10028',
    #           palette_color_accent: 'var(--theme-accent-color)'
    #         }
    #       }
    #     )
    #
    #     config.legacy_typography_variants = {
    #       'accent' => {
    #         palette_color: 'accent'
    #       },
    #       'lgAccent' => {
    #         variant: 'lg',
    #         palette_color: 'accent'
    #       }
    #     }
    #
    # @since 16.1
    attr_accessor :legacy_typography_variants

    def initialize(*)
      super
      @additional_frontend_packs = AdditionalPacks.new
      @additional_editor_packs = AdditionalPacks.new

      @additional_frontend_seed_data = AdditionalSeedData.new
      @content_element_consent_vendors = ContentElementConsentVendors.new
      @consent_vendor_host_matchers = {}

      @legacy_typography_variants = {}
    end
  end
end
