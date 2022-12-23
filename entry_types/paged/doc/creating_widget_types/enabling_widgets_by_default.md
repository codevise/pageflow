# Enabling Widgets by Default

Sometimes it can be desirable to define a default widget type to be
used for a specific role. This way, no manual configuration of entry
or site is required for a widget to be rendered in all entries:

    config.widget_types.register(Rainbow::WidgetType.new, default: true)

The default option registers the widget type as default choice for all
roles supported by the widget type.
