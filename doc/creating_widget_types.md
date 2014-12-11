# @title Creating Widget Types

Pageflow provides an interface to let extensions define new types of
widgets such as navigation bars, headers or analytics snippets to be
used in entries.

Once a widget type is registered, it can either be enabled on a
theming or per-entry basis. Each widget type defines which roles its
instances play in the context of an entry. By default Pagflow knows
the roles `'navigation'`, `'head'` and `'overview'`. For each role only
one widget will be rendered in the entry. Widgets associated with an
entry override those with the same role defined on the theming level.

## The Basic Setup

A widget type is a ruby object that implements the following methods:

    module Pageflow
      module ProgressNaviationBar
        class WidgetType < Pageflow::WidgetType
          def name
            'pageflow_progress_navigation_bar'
          end

          def roles
            ['navigation']
          end

          def render(template, entry)
            # return html representation. For example:
            template.render('pageflow/progress_navigation_bar/widget.html.erb'
                            entry: entry)
          end
        end

        def self.widget_type
          WidgetType.new
        end
      end
    end

It is good practice to define a static factory method for the widget
type as above to be used in the Pageflow initializer:

    # config/initializers/pageflow.rb
    Pageflow.configure do |config|
      config.widget_types.register(Pageflow::ProgressNavigationBar.widget_type)
    end

At this point widgets of the new type can be associated with entries
and will be rendered.

## Enhancing Widgets with Javascript

Most of the time the HTML of a widget has to be brought to live with
the help of some javascript. Pageflow allows a javascript function to
be registered which shall be executed to enhance the rendered HTML
snippet of a widget.

    # app/assets/javascript/pageflow/progress_navigation_bar.js
    pageflow.widget_types.register('pageflow_progress_navigation_bar', {
      enhance: function(element) {
        // some jQuery magic
      }
    });

The name supplied to the register function has to match the one
returned by the `name` method of the widget type. Finally, to
determine which DOM element shall be passed to the `enhance` function,
mark up an element in the widget template with a `data-widget`
attribute matching the widget name.

    # app/views/pageflow/progress_navigation_bar/widget.html.erb
    <div data-widget="pageflow_progress_navigation_bar">
    </div>

## Advanced Options

### Excluding Widgets from Being Rendered in the Editor

Some widgets do not make sense in the context of the editor,
i.e. analytics snippets. Simply override `enabled_in_editor?` inside
your widget type and return false.

    module Pageflow
      module MyAnalytics
        class WidgetType < Pageflow::WidgetType
          # ...

          def enabled_in_editor?
            false
          end
        end
      end
    end

### Enable Widgets by Default

Sometimes it can be desirable to define a default widget type to be
used for a speficic role. That way no manual configuration of entry or
theming is required for a widget to be rendered in all entries:

    config.widget_types.register(Pageflow::MyAnalytics::WidgetType.new, default: true)

The default option registers the widget type as default choice for all
roles supported by the widget type.

### Adding Content to the Page Head

Widget types can contribute to the head of a published entry to add
script or meta tags.

    module Pageflow
      module ProgressNaviationBar
        class WidgetType < Pageflow::WidgetType
          # ...

          def render_head_fragment(template, entry)
            # return html representation. For example:
            template.content_tag(:script, '', src: '//example.com/script.js')
          end
        end
      end
    end
