# Custom Typography

## Custom Fonts

[Fontsource](https://github.com/fontsource/fontsource) is the
recommended way to load custom fonts. Add the npm package for the
font:

    $ yarn add @fontsource/open-sans

Create a Webpacker entry point file for your font:

``` css
    /* app/javascript/packs/fonts/openSans.css */
    @import "@fontsource/open-sans/400.css";
    @import "@fontsource/open-sans/700.css";
```

Adjust theme options to load the font stylesheet pack and set the font
family properties:

``` ruby
entry_type_config.themes.register(:my_custom_theme,
                                  # ...
                                  stylesheet_packs: ['font/openSans'],
                                  properties: {
                                    root: {
                                      entry_font_family: '"Open Sans", sans-serif',
                                      widget_font_family: '"Open Sans", sans-serif'
                                    }
                                  })
```

Different fonts can be used for the main content of the entry and
widgets.

## Typography Rules

Aspects like font size, font weight, letter spacing, margins etc. can
be controlled via so called typography rules. The following rule, for
example, changes the font weight of all headings:

``` ruby
entry_type_config.themes.register(:my_custom_theme,
                                  # ...
                                  typography: {
                                    heading: {
                                      font_weight: 'normal'
                                    }
                                  })
```

All CSS properties can be used, even though it is recommended to
restrict usage to strictly typography related properties. Underscores
in keys will be turned into hyphens.

The following rule names are supported:

| Name | Description |
| ---- | ----------- |
| `heading` | Applies to all headings in the entry content. |
| `heading_lg` | Applies to heading content element with size "large". |
| `heading_md` | Applies to heading content element with size "medium". |
| `heading_sm` | Applies to heading content element with size "small". |
| `heading_xs` | Applies to headings in text block content elements. |
| `body` | Applies to text blocks (paragraphs, lists, block quotes) in the entry content. |
| `caption` | Applies to captions of content elements like inline images or inline videos. |
| `default_navigation_chapter_link` | Applies to chapter links in the default navigation. |
| `default_navigation_active_chapter_link` | Applies to the chapter link representing the current chapter. |

### Responsive Breakpoints

Properties in typography rules can be restricted to only take effect
above a certain viewport width. This, for example, can be used to
change the typography only in the desktop version of the default navigation's
chapter list - not the mobile menu:

``` ruby
entry_type_config.themes.register(:my_custom_theme,
                                  # ...
                                  typography: {
                                    # ...
                                    default_navigation_chapter_link: {
                                      md: {
                                        line_height: '1'
                                      }
                                    },
                                  }
```

Keys inside scopes with hashes as value are treated as
breakpoints. The following breakpoints are available:

* `sm`: Minimum width 640px.
* `md`: Minimum width 768px.
* `lg`: Minimum width 1024px.
* `xl`: Minimum width 1280px.
