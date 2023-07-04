module PageflowScrolled
  # @api private
  class Plugin < Pageflow::Plugin
    def configure(config)
      config.features.register('scrolled_entry_type') do |feature_config|
        feature_config.entry_types.register(PageflowScrolled.entry_type)
      end

      config.for_entry_type(PageflowScrolled.entry_type) do |c|
        c.file_types.register(Pageflow::BuiltInFileType.image)
        c.file_types.register(Pageflow::BuiltInFileType.video)
        c.file_types.register(Pageflow::BuiltInFileType.audio)
        c.file_types.register(Pageflow::BuiltInFileType.other)

        c.revision_components.register(Storyline)

        c.widget_types.register(ReactWidgetType.new(name: 'defaultNavigation',
                                                    role: 'header'),
                                default: true)
        c.widget_types.register(ReactWidgetType.new(name: 'consentBar',
                                                    role: 'consent'),
                                default: true)

        c.features.register('datawrapper_chart_embed_opt_in')
        c.features.enable_by_default('datawrapper_chart_embed_opt_in')
        c.features.register('iframe_embed_content_element')
        c.features.register('image_gallery_content_element')
        c.features.register('frontend_v2')

        c.additional_frontend_seed_data.register(
          'frontendVersion',
          FRONTEND_VERSION_SEED_DATA
        )
      end
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
