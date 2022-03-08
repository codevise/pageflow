# Custom Icons

To use custom icons for buttons like "Share" and "Unmute" in
navigation bars, add a `custom_icons` option when registering the
theme and list the names of the icon you want to customize.

``` ruby
entry_type_config.themes.register(:my_custom_theme,
                                  # ...
                                  custom_icons: [:information,
                                                 :muted,
                                                 :unmuted,
                                                 :share])

```

Pageflow will expect to find the icons under paths of the form
`app/javascript/pageflow-scrolled/themes/my_custom_theme/icons/information.svg`. The
`svg` tag in each of these SVG files needs to have an `id` attribute
with value `icon`.
