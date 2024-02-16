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
| `content_link` | Applies to text links in text blocks, figures, quotes and counters. |
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

### Typography Variants

Certain content elements support offering an input field with
different typography variants for the user to choose from. This can,
for example, be used to support differently styled headings. To define
such variants, add typography rules using on of the prefixes listed
below. Text block elements support specifying different variants per
element type (paragraph, heading, block quote etc.)

The following example defines a typography variant for block quotes in
text block content elements.

``` ruby
entry_type_config.themes.register(:my_custom_theme,
                                  # ...
                                  typography: {
                                    # ...
                                    'text_block-block_quote-red' => {
                                      color: 'red'
                                    }
                                  }

```

Define a translation key to be displayed in the editor:

``` yaml
en:
  pageflow_scrolled:
    editor:
      themes:
        my_custom_theme:
          typography_variants:
            "textBlock-blockQuote-red": "Red"
```

The following prefixes are supported by built in content elements:

| Typography Rule Prefix | Description |
| ---------------------- | ----------- |
| `heading-` | Variants for the heading content element. |
| `text_block-block_quote-` | Variants for block quotes in text block elements. |
| `text_block-bulleted_list-` | Variants for bulleted lists in text block elements. |
| `text_block-heading-` | Variants for headings in text block elements. |
| `text_block-numbered_list-` | Variants for numbered lists in text block elements. |
| `text_block-paragraph-` | Variants for paragraphs in text block elements. |

Typography variants can also assign [text block related theme
properties](./custom_colors_and_dimensions.md#text-block-styles) by
including the `--theme-` prefix:

``` ruby
entry_type_config.themes.register(:my_custom_theme,
                                  # ...
                                  typography: {
                                    # ...
                                    'text_block-bulleted_list-tight' => {
                                       '--theme-text-block-list-item-margin-top' => 0
                                    }
                                  }

```

## Quotes

The `quote_design` theme option can be used to control how quotation
marks in text block blockquotes and stand-alone quotes are styled:

``` ruby
entry_type_config.themes.register(:my_custom_theme,
                                  # ...
                                  quote_design: 'hanging',
```

The following designs are available:

* `'largeHanging'` (default): Display only a large opening quotation
  mark.

* `hanging'`: Display opening and closing quotation marks and indent
  quote text.

* `inline'`: Display opening and closing quotation marks and do not
  indent quote text.

In addition, the following theme properties can be used to further
adjust the design:

| Name | Description |
| ---- | ----------- |
| `quote_attribution_min_width` | Control horizontal position of attribute text. |
| `quote_hanging_mark_spacing` | Distance between quote marks and quote text in `hanging` or `largeHanging` design. |
| `quote_indent` | Length by which to indent the quote text. |
| `quote_left_mark` | Symbol to use for the left quotation mark. |
| `quote_right_mark` | Symbol to use for the left quotation mark. |
| `quote_mark_font_weight` | Font weight of the quotation marks. |
| `quote_mark_opacity` | Opacity of the quotation marks. |
| `quote_large_mark_font_size` | Font size of the quotation mark in the `largeHanging` design. |
| `quote_large_mark_top` | Length by which to translate the translation mark in the `largeHanging` design. |
| `quote_mark_width` | Can be used when `quote_left_mark` or `quote_right_mark` are SVG data URLs. |

These properties need to be passed in the root scope:

``` ruby
entry_type_config.themes.register(:my_custom_theme,
                                  # ...
                                  quote_design: 'hanging',
                                  properties: {
                                    root: {
                                      # ...
                                      quote_left_mark: '"»"',
                                      quote_right_mark: '"«"'
                                    }
                                  }

```
