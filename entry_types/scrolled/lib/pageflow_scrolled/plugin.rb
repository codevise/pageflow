module PageflowScrolled
  # @api private
  class Plugin < Pageflow::Plugin
    def configure(config)
      config.features.register('scrolled_entry_type') do |feature_config|
        feature_config.entry_types.register(PageflowScrolled.entry_type)
      end

      config.for_entry_type(PageflowScrolled.entry_type) do |c|
        padding_scale = {
          'none' => '0px',
          'xxxs' => '1.375em',
          'xxs' => '3em',
          'xs' => '4.375em',
          'sm' => '6em',
          'md' => 'max(7em, 10svh)',
          'lg' => 'max(8em, 10svh)',
          'xl' => 'max(9em, 15svh)',
          'xxl' => 'max(10em, 20svh)',
          'xxxl' => 'max(11em, 30svh)'
        }

        c.themes.register_default_options(
          ThemeOptionsDefaultScale.new(
            prefix: 'section_padding_top',
            values: padding_scale
          )
        )

        c.themes.register_default_options(
          ThemeOptionsDefaultScale.new(
            prefix: 'section_padding_bottom',
            values: padding_scale
          )
        )

        c.themes.register_default_options(
          properties: {
            root: {
              'section_default_padding_top' => '1.375em',
              'section_default_padding_bottom' => '4.375em'
            },
            cards_appearance_section: {
              'section_default_padding_top' => '3em',
              'section_default_padding_bottom' => '6em'
            }
          }
        )

        c.file_types.register(Pageflow::BuiltInFileType.image)
        c.file_types.register(Pageflow::BuiltInFileType.video)
        c.file_types.register(Pageflow::BuiltInFileType.audio)
        c.file_types.register(Pageflow::BuiltInFileType.other)

        c.revision_components.register(Storyline, create_defaults: true)

        ['tikTokEmbed', 'twitterEmbed', 'hotspots', 'socialEmbed'].each do |name|
          c.additional_frontend_packs.register(
            "pageflow-scrolled/contentElements/#{name}-frontend",
            content_element_type_names: [name]
          )
        end

        c.widget_types.register(ReactWidgetType.new(name: 'defaultNavigation',
                                                    role: 'header'),
                                default: true)
        c.widget_types.register(ReactWidgetType.new(name: 'consentBar',
                                                    role: 'consent'),
                                default: true)
        c.widget_types.register(ReactWidgetType.new(name: 'iconInlineFileRights',
                                                    role: 'inlineFileRights'),
                                default: true)
        c.widget_types.register(ReactWidgetType.new(name: 'textInlineFileRights',
                                                    role: 'inlineFileRights'))

        c.features.register('excursion_sheets') do |feature_config|
          feature_config.widget_types.register(
            ReactWidgetType.new(name: 'excursionSheet',
                                role: 'excursion'),
            default: true
          )

          feature_config.widget_types.register(
            ReactWidgetType.new(name: 'mainStorylineSheet',
                                role: 'mainStoryline'),
            default: true
          )
        end

        c.features.enable_by_default('excursion_sheets')

        c.features.register('icon_scroll_indicator') do |feature_config|
          feature_config.widget_types.register(
            ReactWidgetType.new(name: 'iconScrollIndicator',
                                role: 'scrollIndicator')
          )
        end

        c.features.register('datawrapper_chart_embed_opt_in')
        c.features.enable_by_default('datawrapper_chart_embed_opt_in')
        c.features.register('iframe_embed_content_element')
        c.features.register('social_embed_content_element')
        c.features.register('legacy_social_embed_content_elements')
        c.features.register('frontend_v2')
        c.features.register('scrolled_entry_fragment_caching')
        c.features.register('backdrop_content_elements')
        c.features.register('custom_palette_colors')
        c.features.register('decoration_effects')
        c.features.register('content_element_margins')
        c.features.register('backdrop_size')
        c.features.register('section_paddings')

        c.features.register('faq_page_structured_data') do |feature_config|
          feature_config.entry_structured_data_types.register(
            :faq_page,
            PageflowScrolled::EntryStructuredDataTypes::FaqPage.new
          )
        end

        c.additional_frontend_seed_data.register(
          'frontendVersion',
          FRONTEND_VERSION_SEED_DATA
        )

        c.content_element_consent_vendors.register(
          IFRAME_EMBED_CONSENT_VENDOR,
          content_element_type_name: 'iframeEmbed'
        )

        c.content_element_consent_vendors.register(
          SOCIAL_EMBED_CONSENT_VENDOR,
          content_element_type_name: 'socialEmbed'
        )
      end
    end

    IFRAME_EMBED_CONSENT_VENDOR = lambda do |configuration:, entry:, **|
      return unless configuration['requireConsent']

      uri = URI.parse(configuration['source'])
      host_matchers = Pageflow.config_for(entry).consent_vendor_host_matchers

      host_matchers.detect { |matcher, _|
        uri.host =~ matcher
      }&.last
    rescue URI::InvalidURIError
      nil
    end

    SOCIAL_EMBED_CONSENT_VENDOR = lambda do |configuration:, **|
      provider = configuration['provider']
      valid_providers = ['x', 'instagram', 'bluesky', 'tiktok']

      valid_providers.include?(provider) ? provider : nil
    end

    FRONTEND_VERSION_SEED_DATA = lambda do |request:, entry:, **|
      if request.params[:frontend] == 'v2' || entry.feature_state('frontend_v2')
        2
      else
        1
      end
    end
  end
end
