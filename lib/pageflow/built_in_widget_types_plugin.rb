module Pageflow
  class BuiltInWidgetTypesPlugin < Plugin
    def configure(config)
      config.widget_types.register(Pageflow::BuiltInWidgetType.navigation, default: true)
      config.widget_types.register(Pageflow::BuiltInWidgetType.mobile_navigation, default: true)
      config.widget_types.register(Pageflow::BuiltInWidgetType.slim_player_controls)
      config.widget_types.register(Pageflow::BuiltInWidgetType.classic_player_controls, default: true)
      config.widget_types.register(Pageflow::BuiltInWidgetType.cookie_notice_bar)
    end
  end
end
