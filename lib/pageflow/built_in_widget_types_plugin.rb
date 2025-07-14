module Pageflow
  # @api private
  class BuiltInWidgetTypesPlugin < Plugin
    def configure(config)
      config.for_entry_type(PageflowPaged.entry_type) do |entry_type_config|
        slideshow_mode(entry_type_config)
        loading_spinner(entry_type_config)
        navigation(entry_type_config)
        player_controls(entry_type_config)
        cookie_notice(entry_type_config)
        consent_bar(entry_type_config)
        background_media_control(entry_type_config)
      end
    end

    private

    def slideshow_mode(config)
      config.widget_types.register(BuiltInWidgetType.default_slideshow_mode, default: true)

      config.features.register('phone_horizontal_slideshow_mode') do |feature_config|
        feature_config.widget_types.register(BuiltInWidgetType.phone_horizontal_slideshow_mode)
      end
    end

    def loading_spinner(config)
      config.widget_types.register_widget_defaults('loading_spinner',
                                                   'blur_strength' => 50,
                                                   'remove_logo' => false,
                                                   'invert' => false)

      config.widget_types.register(BuiltInWidgetType.classic_loading_spinner, default: true)

      config.features.register('title_loading_spinner') do |feature_config|
        feature_config.widget_types.register(BuiltInWidgetType.media_loading_spinner)
        feature_config.widget_types.register(BuiltInWidgetType.title_loading_spinner)
      end

      config.features.enable_by_default('title_loading_spinner')
    end

    def navigation(config)
      config.widget_types.register(BuiltInWidgetType.navigation, default: true)
      config.widget_types.register(BuiltInWidgetType.mobile_navigation, default: true)
    end

    def player_controls(config)
      config.widget_types.register(Pageflow::BuiltInWidgetType.slim_player_controls)
      config.widget_types.register(Pageflow::BuiltInWidgetType.classic_player_controls,
                                   default: true)
    end

    def cookie_notice(config)
      config.widget_types.register(BuiltInWidgetType.cookie_notice_bar)
    end

    def consent_bar(config)
      config.features.register('consent_bar') do |feature_config|
        feature_config.widget_types.register(BuiltInWidgetType.consent_bar, default: true)
      end
    end

    def background_media_control(config)
      config.widget_types.register(BuiltInWidgetType.unmute_button, default: true)
    end
  end
end
