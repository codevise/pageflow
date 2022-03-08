# Wiget Margins

## Specifying Widget Margins

If the widget covers space along one of the window margins (i.e. a
vertical navigation bar), it can be desirable to prevent page content
from being hidden by the widget. By declaring widget margins, you can
ensure that page elements like videos leave a safe area for your
widget.

For example, if your widget covers an `80px` wide area along the right
page margin, you can specify this using the `pageflow-widget-margin`
mixin:

    # app/assets/stylesheets/my_widget/themes/default.scss
    @include pageflow-widget-margin("my_widget", "right") {
      margin-right: 80px;
    }

Now the margin is applied to all page elements that align along the
right side of window. If your widget changes its size responsively,
you can use media queries inside the mixin block:

    # app/assets/stylesheets/my_widget/themes/default.scss
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

## Applying Widget Margin

If you would like to control the position of your widget, according to
widget margins defined by other present widgets, you can extend one of
the `pageflow_widget_margin` placeholders:

    # app/assets/stylesheets/my_widget/themes/default.scss
    .my_widget {
      @extend pageflow_widget_margin_right !optional;
    }

This will cause the corresponding margin to be applied to your
element, whenever one of the present widget specifies a widget
margin. The `!optional` suffix is required, to prevent compilation
errors if no widget defines a margin with the given position.
