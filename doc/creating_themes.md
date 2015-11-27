# @title Creating Themes

## Defining the Color Scheme

TODO

## Custom Page Type Pictograms

By default, each page type brings its own set of pictogram images for
display inside navigations bars and overviews. Default pictograms are
usually located in a directory named
`app/assets/images/pageflow/<page_type_name>/themes/default/pictograms`
inside the page type gem.

To supply custom pictograms, add the following line to your theme
file:

    # pageflow/themes/my_theme.scss
    $custom-page-type-picotgrams: true;

This causes pictograms to be looked for in
`pageflow/themes/<theme_name>/page_type_pictograms/<page_type_name>/`
inside your apps image directory. Each directory must contain the
following variants:

* `wide.png`
* `sprite.png`
