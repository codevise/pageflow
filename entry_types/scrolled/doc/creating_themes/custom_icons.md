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
| arrowLeft | Arrow used for scroll indicators (e.g., in chapter scroller or image gallery). |
| arrowRight | Arrow used for scroll indicators (e.g., in chapter scroller or image gallery). |
| copyright | Used in inline file rights. |
| close | Used for overlay close buttons. |
| email | Used in share box. |
| expand | Arrow icon displayed in FAQ content elements. |
| facebook | Used in share box. |
| gear | Used for quality menu in video players. |
| information | Used for button to toggle credits box in navigation bars and third party consent tooltips. |
| linkedIn | Used in share box. |
| menu | Used in place of the animated burger menu item in the mobile navigation. |
| muted | Used for button to unmute sound in navigation bar and sound disclaimer content element. |
| share | Used for share button in navigation bar. |
| telegram | Used in share box. |
| twitter | Used in share box. |
| unmuted | Used button to mute sound in navigation bar and sound disclaimer content element. |
| world | Used for translations menu. |
| whatsApp | Used in share box. |
