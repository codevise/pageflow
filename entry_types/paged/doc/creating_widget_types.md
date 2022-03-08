# Creating Widget Types

Pageflow provides an interface to let plugins define new types of
widgets such as navigation bars, headers or analytics snippets to be
used in entries.

Once a widget type is registered, it can either be enabled on a
theming or per-entry basis. Each widget type defines which roles its
instances play in the context of an entry. By default, Pageflow knows
the roles `'navigation'`, `'head'` and `'overview'`, but arbitrary new
roles can be specified by a widget type. For each role only one widget
will be rendered in the entry. Widgets associated with an entry
override those with the same role defined on the theming level.

* [Creating Widget Types with ERB Templates](creating_widget_types/with_erb_templates.md)

  Mostly recommended for statically rendered widgets that do not
  require a lot of JavaScript interactivity. A lot of the existing
  widget types (navigation bars etc.) still rely on this approach.

* [Creating Widget Types with React Components](creating_widget_types/with_react_components.md)

  The recommended approach for widgets that include client side
  logic. Does not support server side rendering at the moment.
