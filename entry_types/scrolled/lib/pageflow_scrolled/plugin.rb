module PageflowScrolled
  # @api private
  class Plugin < Pageflow::Plugin # rubocop:disable Metrics/ClassLength
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

        margin_scale = {
          'xxs' => '2em',
          'xs' => '3em',
          'sm' => '4em',
          'md' => '6em',
          'lg' => '10em',
          'xl' => '12em',
          'xxl' => '16em'
        }

        box_shadow_scale = {
          'sm' => '0 1px 3px 0 rgb(0 0 0 / 0.2), 0 1px 2px -1px rgb(0 0 0 / 0.15)',
          'md' => '0 4px 6px -1px rgb(0 0 0 / 0.2), 0 2px 4px -2px rgb(0 0 0 / 0.15)',
          'lg' => '0 10px 15px -3px rgb(0 0 0 / 0.2), 0 4px 6px -4px rgb(0 0 0 / 0.12)',
          'xl' => '0 20px 25px -5px rgb(0 0 0 / 0.2), 0 8px 10px -6px rgb(0 0 0 / 0.12)'
        }

        c.themes.register_options_transform(
          ThemeOptionsDefaultScale.new(
            prefix: 'section_padding_top',
            values: padding_scale
          )
        )

        c.themes.register_options_transform(
          ThemeOptionsDefaultScale.new(
            prefix: 'section_padding_bottom',
            values: padding_scale
          )
        )

        c.themes.register_options_transform(
          ThemeOptionsDefaultScale.new(
            prefix: 'content_element_margin',
            values: margin_scale
          )
        )

        c.themes.register_options_transform(
          ThemeOptionsDefaultScale.new(
            prefix: 'content_element_box_shadow',
            values: box_shadow_scale
          )
        )

        c.themes.register_default_options(
          properties: {
            root: {
              'section_default_padding_top' => 'max(10em, 20svh)',
              'section_default_padding_bottom' => 'max(10em, 20svh)',
              'content_element_margin_style_default' => '2em',
              'content_element_box_shadow_style_default' =>
                '0 4px 6px -1px rgb(0 0 0 / 0.2), 0 2px 4px -2px rgb(0 0 0 / 0.15)',
              'box_shadow_clip_margin_bottom' => '3rem',
              'outline_color' => '#a0a0a080'
            },
            cards_appearance_section: {
              'section_default_padding_top' => 'max(10em, 20svh)',
              'section_default_padding_bottom' => 'max(10em, 20svh)'
            }
          }
        )

        legacy_paddings = {
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
        }

        c.themes.register_options_transform(lambda { |options, entry:, **|
          if entry.layout_version
            options
          else
            options.deep_merge(legacy_paddings)
          end
        })

        c.themes.register_default_options(
          typography: {
            'counterNumber-xxxl' => {
              font_size: '200px', line_height: '1',
              sm: {font_size: '350px'}
            },
            'counterNumber-xxl' => {
              font_size: '150px', line_height: '1',
              sm: {font_size: '265px'}
            },
            'counterNumber-xl' => {
              font_size: '110px', line_height: '1',
              sm: {font_size: '200px'}
            },
            'counterNumber-lg' => {
              font_size: '86px', line_height: '1',
              sm: {font_size: '150px'}
            },
            'counterNumber-md' => {
              font_size: '66px', line_height: '1',
              sm: {font_size: '110px'}
            },
            'counterNumber-sm' => {
              font_size: '52px', line_height: '1',
              sm: {font_size: '86px'}
            },
            'counterNumber-xs' => {
              font_size: '40px', line_height: '1.1',
              sm: {font_size: '66px', line_height: '1'}
            },
            'counterNumber-xxs' => {
              font_size: '34px', line_height: '1.1',
              sm: {font_size: '52px', line_height: '1'}
            },
            'counterNumber-xxxs' => {
              font_size: '28px', line_height: '1.1',
              sm: {font_size: '40px', line_height: '1'}
            },
            'counterUnit-md' => {font_size: '1em'},
            'counterUnit-sm' => {font_size: '0.7em'},
            'counterUnit-xs' => {font_size: '0.5em'},
            'counterDescription-lg' => {
              font_size: '28px', line_height: '1.1',
              sm: {font_size: '40px', line_height: '1'}
            },
            'counterDescription-md' => {font_size: '22px'},
            'counterDescription-sm' => {font_size: '18px'}
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
        c.features.register('scrolled_entry_fragment_caching')
        c.features.register('backdrop_content_elements')
        c.features.register('custom_palette_colors')
        c.features.register('decoration_effects')
        c.features.register('backdrop_size')
        c.features.register('image_srcset')
        c.features.enable_by_default('image_srcset')

        c.features.register('faq_page_structured_data') do |feature_config|
          feature_config.entry_structured_data_types.register(
            :faq_page,
            PageflowScrolled::EntryStructuredDataTypes::FaqPage.new
          )
        end

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
      url_matchers = Pageflow.config_for(entry).consent_vendor_url_matchers

      url_matchers.detect { |matcher, _|
        (uri.host + uri.path) =~ matcher
      }&.last
    rescue URI::InvalidURIError
      nil
    end

    SOCIAL_EMBED_CONSENT_VENDOR = lambda do |configuration:, **|
      provider = configuration['provider']
      valid_providers = ['x', 'instagram', 'bluesky', 'tiktok']

      valid_providers.include?(provider) ? provider : nil
    end
  end
end
