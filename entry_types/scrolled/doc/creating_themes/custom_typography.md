# Custom Typography

## Custom Fonts

Place the font files inside the theme's asset directory and declare
one font face per weight/style combination:

``` ruby
entry_type_config.themes.register(:my_custom_theme,
                                  # ...
                                  font_faces: [
                                    {family: 'Open Sans',
                                     weight: '400',
                                     style: 'normal',
                                     src: 'fonts/open-sans-400-normal.woff2'},
                                    {family: 'Open Sans',
                                     weight: '700',
                                     style: 'normal',
                                     src: 'fonts/open-sans-700-normal.woff2'}
                                  ],
                                  properties: {
                                    root: {
                                      entry_font_family: '"Open Sans", sans-serif',
                                      widget_font_family: '"Open Sans", sans-serif'
                                    }
                                  })
```

Different fonts can be used for the main content of the entry and
widgets.

The resulting `@font-face` rules are rendered into the same style tag
as the theme's other custom properties - both in published entries and
in the editor. Since no separate stylesheet needs to be requested, the
browser can start loading font files earlier.

The following keys are supported:

| Key | Description |
| --- | ----------- |
| `family` | Font family name to reference in font family properties and typography rules. |
| `src` | Path or url of the font file. See below. |
| `format` | Format of the font file. Derived from the file extension by default. |
| `weight` | Weight provided by the font file. Either a single value or a range like `'300 900'` for variable fonts. |
| `style` | Either `normal` or `italic`. |
| `unicode_range` | Code points provided by the font file. See below. |
| `file_role` | Role of an uploaded theme customization file to use instead of `src`. |
| `preload` | Pass `true` to let the browser start downloading the font file right away. See below. |

`font-display: swap` is always included so that text remains visible
while font files are loading. Faces with invalid values are skipped.

### Font File Paths

Relative `src` paths are resolved inside the theme's asset directory,
just like icons and logos. Paths starting with `../shared/` refer to
the shared theme directory:

``` ruby
src: '../shared/fonts/open-sans-400-normal.woff2'
```

Absolute urls and paths are used as is.

### Multiple Formats

Pass an array to let the browser pick the first format it supports:

``` ruby
{family: 'Open Sans',
 weight: '400',
 src: ['fonts/open-sans-400-normal.woff2',
       'fonts/open-sans-400-normal.woff']}
```

The `format` key applies to all sources of the face. Use hashes to
specify formats per source:

``` ruby
{family: 'Open Sans Variable',
 weight: '300 900',
 src: [{url: 'fonts/open-sans-wght-normal.woff2', format: 'woff2-variations'},
       'fonts/open-sans-400-normal.woff']}
```

### Preloading Fonts

Browsers only download a font file once they lay out text that uses
the font face. Mark the few faces that are needed for the first
screenful to have the file requested as early as possible:

``` ruby
{family: 'Open Sans',
 weight: '400',
 src: 'fonts/open-sans-400-normal.woff2',
 preload: true}
```

Published entries then contain a link tag in the head:

``` html
<link rel="preload" as="font" type="font/woff2"
      href="/assets/fonts/open-sans-400-normal.woff2" crossorigin="anonymous">
```

Only the first source of the face is preloaded since the browser
downloads exactly one of the alternative formats. Preloading more
fonts than the entry displays right away delays other resources - only
mark faces that are used above the fold.

### Reducing Font File Size

Fonts that support many scripts can be split into subsets. Declare one
face per subset and use `unicode_range` to let the browser download
only those subsets that contain code points used in the entry:

``` ruby
font_faces: [
  {family: 'Open Sans',
   weight: '400',
   src: 'fonts/open-sans-latin-400-normal.woff2',
   unicode_range: 'U+0000-00FF, U+0131, U+0152-0153'},
  {family: 'Open Sans',
   weight: '400',
   src: 'fonts/open-sans-latin-ext-400-normal.woff2',
   unicode_range: 'U+0100-024F, U+0259, U+1E00-1EFF'}
]
```

Packages published by
[Fontsource](https://github.com/fontsource/fontsource) contain the
ranges of their subsets in a `unicode.json` file.

### Loading Fonts via Stylesheet Packs

Alternatively, fonts can be loaded by referencing a stylesheet pack
which contains `@font-face` rules. Add the npm package for the font:

    $ yarn add @fontsource/open-sans

Create a Webpacker entry point file for your font:

``` css
    /* app/javascript/packs/fonts/openSans.css */
    @import "@fontsource/open-sans/400.css";
    @import "@fontsource/open-sans/700.css";
```

Adjust theme options to load the font stylesheet pack:

``` ruby
entry_type_config.themes.register(:my_custom_theme,
                                  # ...
                                  stylesheet_packs: ['fonts/openSans'],
                                  properties: {
                                    root: {
                                      entry_font_family: '"Open Sans", sans-serif',
                                      widget_font_family: '"Open Sans", sans-serif'
                                    }
                                  })
```

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
| `heading_tagline` | Applies to taglines in heading content elements. |
| `heading_tagline_lg` | Applies to taglines in heading content element with size "large". |
| `heading_tagline_md` | Applies to taglines in heading content element with size "medium". |
| `heading_tagline_sm` | Applies to taglines in heading content element with size "small". |
| `heading_subtitle` | Applies to subtitles in heading content elements. |
| `heading_subtitle_lg` | Applies to subtitles in heading content element with size "large". |
| `heading_subtitle_md` | Applies to subtitles in heading content element with size "medium". |
| `heading_subtitle_sm` | Applies to subtitles in heading content element with size "small". |
| `body` | Applies to text blocks (paragraphs, lists, block quotes) in the entry content. |
| `caption` | Applies to captions of content elements like inline images or inline videos. |
| `content_link` | Applies to text links in text blocks, figures, quotes, and counters. |
| `quote_text` | Applies to the main text of quote content elements. |
| `quote_text_lg` | Applies to the main text of quote content elements with size "large". |
| `quote_text_md` | Applies to the main text of quote content elements with size "medium". |
| `quote_text_sm` | Applies to the main text of quote content elements with size "small". |
| `quote_text_xs` | Applies to the main text of quote content elements with size "very small". |
| `quote_attribution` | Applies to the attribution line in quote content elements. |
| `quote_attribution_lg` | Applies to the attribution line of quote content elements with size "large". |
| `quote_attribution_md` | Applies to the attribution line of quote content elements with size "medium". |
| `quote_attribution_sm` | Applies to the attribution line of quote content elements with size "small". |
| `quote_attribution_xs` | Applies to the attribution line of quote content elements with size "very small". |
| `default_navigation_chapter_link` | Applies to chapter links in the default navigation. |
| `default_navigation_chapter_summary` | Applies to chapter summary texts in the default navigation. |
| `default_navigation_active_chapter_link` | Applies to the chapter link representing the current chapter. |
| `external_link_title` | Applies to titles of external links. |
| `external_link_description` | Applies to descriptions of external links. |
| `counter_number` | Applies to the number in counter elements. |
| `counter_description` | Applies to the description text in counter elements. |
| `hotspot_tooltip_title` | Applies to the title in hotspot tooltips. |
| `hotspot_tooltip_description` | Applies to the description text in hotspot tooltips. |
| `hotspot_tooltip_link` | Applies to link buttons in hotspot tooltips. |
| `info_table_label` | Applies to first column of info tables. |
| `info_table_value` | Applies to second column of info tables. |


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
| `heading_tagline-` | Variants for tagline in heading content element. |
| `heading_subtitle-` | Variants for subtitle in heading content element. |
| `text_block-block_quote-` | Variants for block quotes in text block elements. |
| `text_block-bulleted_list-` | Variants for bulleted lists in text block elements. |
| `text_block-heading-` | Variants for headings in text block elements. |
| `text_block-numbered_list-` | Variants for numbered lists in text block elements. |
| `text_block-paragraph-` | Variants for paragraphs in text block elements. |
| `question-` | Variants for question text in question elements. |
| `question_answer-` | Variants for answer text in question elements. |

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

## Editable Text Inline Text Styles

The following properties apply to editable text that has been
formatted via the hovering toolbar:

| Name | Description |
| ---- | ----------- |
| `editable_text_bold_font_weight` | Font weight to apply to bold formatted text. |

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
| `quote_attribution_first_line_font_weight` | Font weight of the quote attribution's first line. Bold by default. |
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
