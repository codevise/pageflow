# Custom Colors and Dimensions

Properties passed on theme registration turn into CSS custom
properties. The theme plugin created by the install generator sets
properties for colors and fonts.

## Scopes

By default all properties are set in the `root` scope, which
corresponds to the CSS `:root` selector. Widget types and content
element types can define additional scopes to limit where certain
properties apply. For example, you can change the background color of
the default navigation bar to grey, but keep the white background for
all other widgets:

``` ruby
entry_type_config.themes.register(:my_custom_theme,
                                  # ...
                                  properties: {
                                    root: {
                                      # ...
                                      widget_surface_color: '#fff'
                                    },

                                    default_navigation: {
                                      # ...
                                      widget_surface_color: '#eee'
                                    }
                                  }
```

The following scopes are available:

* `root`: Values apply universally.

* `default_navigation`: Override color options for the default
  navigation bar only.

* `default_navigation_chapter_list`: Override color options for the
  chapter list of the default navigation bar. Note that these also
  apply to the chapter list in the mobile menu.

* `tooltip`: Override color options for the share and legal tooltips
  of the default navigation bar.

Custom widget and content element types can define additional scopes.

## Responsive Breakpoints

Properties can be restricted to only take effect above a certain
viewport width. This, for example, can be used to change colors only
in the desktop version of the default navigation's chapter list - not
the mobile menu:

``` ruby
entry_type_config.themes.register(:my_custom_theme,
                                  # ...
                                  properties: {
                                    # ...

                                    default_navigation_chapter_list: {
                                      md: {
                                        widget_primary_color: '#000'
                                      }
                                    }
                                  }
```

Keys inside scopes with hashes as value are treated as
breakpoints. The following breakpoints are available:

* `sm`: Minimum width 640px.
* `md`: Minimum width 768px.
* `lg`: Minimum width 1024px.
* `xl`: Minimum width 1280px.

## Available Properties

### Global Colors

| Name | Description |
| ---- | ----------- |
| `accent_color` | Used for progress bar, active chapter and active icons in the default navigation. Text color of links in third party content bar. Default color for audio waveforms. |

### Content Colors

| Name | Description |
| ---- | ----------- |
| `light_content_text_color` | Color of text in sections with dark background. |
| `dark_content_text_color` | Color of text in inverted sections with light background. |
| `light_content_surface_color` | Color of light surfaces like cards or figure captions. |
| `dark_content_surface_color` | Color of dark surfaces like inverted cards or figure captions. |

### Content Widths

By default, apart from a percentage padding, section content spans the
whole width of the screen: Left aligned text stays at the very left of
the screen. Sticky elements in left aligned sections move over all the
way to the right section margin. Themes can limit choose to limit this
width:

| Name | Description |
| ---- | ----------- |
| `section_max_width` | Settings this property causes section content to be centered once the viewport becomes too wide. |

Depending on their position, content elements have a maximum width by
default to limit text line length. The following properties can be
used to adjust these widths for sections using content alignment
"left" or "right":

| Name | Description |
| ---- | ----------- |
| `two_column_inline_content_max_width` | Maximum width of inline content (e.g., text block paragraphs) . |
| `two_column_sticky_content_max_width` | Maximum width of sticky content (e.g., inline images using position "sticky"). |
| `two_column_wide_content_max_width` | Maximum width of wide content (e.g., headings using their default position). |
| `two_column_sticky_content_width` | Percentage width of sticky elements. |

The following properties control width of content elements in section
with content alignment "center":

| Name | Description |
| ---- | ----------- |
| `centered_inline_content_max_width` | Maximum width of inline content (e.g., text block paragraphs). |
| `centered_wide_content_max_width` | Maximum width of wide content (e.g., headings using their default position). |

For all of these properties, also a variant using the prefix
`narrow_section_` can be defined (e.g. `narrow_section_max_width` or
`narrow_section_two_column_inline_content_max_width`. If one of these
properties is defined for a theme, Pageflow offers an additional
"Width" field in the section settings. The given values apply to a
section once "Narrow" has been selected as width.

To prevent sticky elements from overlapping inline elements on narrow
viewports, the following property can be used to control the
breakpoint below which sticky elements become inline:

| Name | Description |
| ---- | ----------- |
| `narrow_viewport_breakpoint` | Minimum viewport width for sticky elements to be displayed in a second column. |

### Content Element Style

The following properties apply to all content elements that render
content in a visible box: inline images, inline videos, before/after
elements etc.

| Name | Description |
| ---- | ----------- |
| `content_element_box_border_radius` | Display content element boxes with rounded corners. |

### Shared Widget Colors

Surfaces use colors from specific categories in your color palette,
such as a primary color. Whenever elements, such as text or icons,
appear in front of those surfaces, those elements should use colors
designed to be clear and legible against the colors behind them.

This category of colors is called “on” colors, referring to the fact
that they color elements that appear “on” top of surfaces that use the
following colors: a primary color, secondary color, surface color,
background color, or error color. When a color appears “on” top of a
primary color, it’s called an “on primary color.” They are labelled
using the original color category (such as primary color) with the
prefix “on.” (Adapted from the [Material Design Color
System](https://material.io/design/color/the-color-system.html#color-theme-creation))

| Name | Description |
| ---- | ----------- |
| `widget_surface_color` | Background of widgets. |
| `widget_on_surface_color` | Text and icons of widget. |
| `widget_primary_color` | Used for highlighted icons (e.g., the unmute icon) and buttons that represent the primary action (e.g., the "Accept all" button in the consent bar). |
| `widget_on_primary_color` | Text color of buttons using the primary color. |
| `widget_secondary_color` | Used for icons (e.g. the share and info icon) and buttons that represent secondary actions (e.g. the "Reject all" button in the consent bar). |
| `widget_on_seconday_color` | Text color of buttons using the secondary color. |
| `widget_background_color` | Used for covering backgrounds. (e.g., the backdrop of the mobile navigation). |
| `widget_on_background_color` | Text color on backgrounds. |

### Widget Margins

| Name | Description |
| ---- | ----------- |
| `widget_margin_top` | Margin to apply to the content of the entry to keep it from being hidden behind a navigation bar. |

### Default Navigation Bar Dimensions

| Name | Description |
| ---- | ----------- |
| `default_navigation_bar_height` | Height of the navigation bar excluding the progress indicator. |
| `default_navigation_scroller_top` | Position of the horizontal scroller containing the chapter list. |
| `default_navigation_scroll_button_top` | Position of the left/right scroll buttons visible when the chapter list overflows horizontally. |
| `default_navigation_chapter_link_height` | Height of the links inside the horizontal chapter list. |
| `default_navigation_chapter_progress_indicator_height` | Height of the progress indicator. |
