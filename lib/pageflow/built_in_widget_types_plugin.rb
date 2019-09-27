module Pageflow
  class BuiltInWidgetTypesPlugin < Plugin
    def configure(config)
      config.widget_types.register(Pageflow::BuiltInWidgetType.default_slideshow_mode,
                                   default: true)

      config.features.register('phone_horizontal_slideshow_mode') do |feature_config|
        feature_config.widget_types.register(Pageflow::BuiltInWidgetType
                                               .phone_horizontal_slideshow_mode)
      end

      config.widget_types.register_widget_defaults('loading_spinner',
                                                   'blur_strength' => 50,
                                                   'remove_logo' => false,
                                                   'invert' => false)
      config.widget_types.register(Pageflow::BuiltInWidgetType.classic_loading_spinner,
                                   default: true)

      config.features.register('title_loading_spinner') do |feature_config|
        feature_config.widget_types.register(Pageflow::BuiltInWidgetType.media_loading_spinner)
        feature_config.widget_types.register(Pageflow::BuiltInWidgetType.title_loading_spinner)
      end
      config.features.enable_by_default('title_loading_spinner')

      config.widget_types.register(Pageflow::BuiltInWidgetType.navigation, default: true)
      config.widget_types.register(Pageflow::BuiltInWidgetType.mobile_navigation, default: true)
      config.widget_types.register(Pageflow::BuiltInWidgetType.slim_player_controls)
      config.widget_types.register(Pageflow::BuiltInWidgetType.classic_player_controls, default: true)
      config.widget_types.register(Pageflow::BuiltInWidgetType.cookie_notice_bar)
      config.widget_types.register(Pageflow::BuiltInWidgetType.unmute_button, default: true)
    end
  end
end
