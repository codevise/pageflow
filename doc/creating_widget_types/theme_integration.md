# Theme Integration

It is recommended to provide a `<widget_name>/themes/default.scss`
file that can be imported in themes. Use SCSS variables with default
values to give custom themes the opportunity to customize the default
appearance. Prefix all variables with your plugin name and provide
SassDoc inline documentation.

    # app/assets/stylesheets/my_widget/themes/default.scss
    /// Describe the variable here
    $my-widget-icon-color: #fff !default;

