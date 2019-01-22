module Pageflow
  class BuiltInWidgetTypesPlugin < Plugin
    def configure(config)
      config.widget_types.register(Pageflow::BuiltInWidgetType.default_slideshow_mode,
                                   default: true)
      config.widget_types.register(Pageflow::BuiltInWidgetType.phone_horizontal_slideshow_mode)

      config.widget_types.register(Pageflow::BuiltInWidgetType.classic_loading_spinner,
                                   default: true)

      config.features.register('title_loading_spinner') do |feature_config|
        feature_config.widget_types.register(Pageflow::BuiltInWidgetType.title_loading_spinner)
      end

      config.widget_types.register(Pageflow::BuiltInWidgetType.navigation, default: true)
      config.widget_types.register(Pageflow::BuiltInWidgetType.mobile_navigation, default: true)
      config.widget_types.register(Pageflow::BuiltInWidgetType.slim_player_controls)
      config.widget_types.register(Pageflow::BuiltInWidgetType.classic_player_controls, default: true)
      config.widget_types.register(Pageflow::BuiltInWidgetType.cookie_notice_bar)
      config.widget_types.register(Pageflow::BuiltInWidgetType.unmute_button, default: true)
    end
  end
end
