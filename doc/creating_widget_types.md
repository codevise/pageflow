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
    pageflow.widgetTypes.register('pageflow_progress_navigation_bar', {
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

## Theme Integration

It is recommended to provide a
`pageflow/<widget_name>/themes/default.scss` file that can be imported
in themes. Use SCSS variables with default values to give custom
themes the opportunity to customize the default appearance. Prefix all
variables with your plugin name and provide SassDoc inline
documentation.

    # app/assets/stylesheets/pageflow/my_widget/themes/default.scss
    /// Describe the variable here
    $my-widget-icon-color: #fff !default;

### Specifying Widget Margins

If the widget covers space along one of the window margins (i.e. a
vertical navigation bar), it can be desirable to prevent page content
from being hidden by the widget. By declaring widget margins, you can
ensure that page elements like videos leave a safe area for your
widget.

For example, if your widget covers an `80px` wide area along the right
page margin, you can specify this using the `pageflow-widget-margin`
mixin:

    # app/assets/stylesheets/pageflow/my_widget/themes/default.scss
    @include pageflow-widget-margin("my_widget", "right") {
      margin-right: 80px;
    }

Now the margin is applied to all page elements that align along the
right side of window. If your widget changes its size responsively,
you can use media queries inside the mixin block:

    # app/assets/stylesheets/pageflow/my_widget/themes/default.scss
    @include pageflow-widget-margin("my_widget", "right") {
      @include desktop {
        margin-right: 80px;
      }
    
      @include pad_portrait {
        margin-right: 30px;
      }
    }

In addition to the widget margin positions `top`, `left`, `bottom` and
`right`, there are also the positions `top_max`, `left_max`,
`bottom_max` and `right_max`. These can be used to specify the maximal
size of a widget that, for example, expands on hover. Page elements
like player controls, can use this informationto prevent the expanded
widget from overlapping.

    @include pageflow-widget-margin("my_widget", "right") {
      margin-right: 80px;
    }

    @include pageflow-widget-margin("my_widget", "right_max") {
      margin-right: 200px;
    }

### Applying Widget Margin

If you would like to control the position of your widget, according to
widget margins defined by other present widgets, you can extend one of
the `pageflow_widget_margin` placeholders:

    # app/assets/stylesheets/pageflow/my_widget/themes/default.scss
    .my_widget {
      @extend pageflow_widget_margin_right !optional;
    }

This will cause the corresponding margin to be applied to your
element, whenever one of the present widget specifies a widget
margin. The `!optional` suffix is required, to prevent compilation
errors if no widget defines a margin with the given position.

## Advanced Options

### Excluding Widgets from Being Rendered in certain Scopes

Some widgets do not make sense in the context of the editor or the
preview, i.e. analytics snippets. Simply override `enabled_in_editor?`
or `enabled_in_preview?` inside your widget type and return `false`.

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
