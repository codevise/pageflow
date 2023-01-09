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

The following icons can be customized:

| Name | Description |
| ---- | ----------- |
| expand | Arrow icon displayed in FAQ content elements. |
| information | Used for button to toggle credits box in navigation bars and third party consent tooltips. |
| muted | Used for button to unmute sound in navigation bar and sound disclaimer content element. |
| share | Used for share button in navigation bar. |
| unmuted | Used button to mute sound in navigation bar and sound disclaimer content element. |
| email | Used in share box. |
| facebook | Used in share box. |
| linkedIn | Used in share box. |
| telegram | Used in share box. |
| twitter | Used in share box. |
| whatsApp | Used in share box. |
