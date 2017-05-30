Pageflow.configure do |config|
  config.widget_types.register(Pageflow::BuiltInWidgetType.navigation, default: true)
  config.widget_types.register(Pageflow::BuiltInWidgetType.mobile_navigation, default: true)
end
