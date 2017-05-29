# Creating Themes

**Available as of Pageflow version 0.11**

Themes consist of stylesheets and images which alter the look of a
Pageflow installation. Pageflow comes with a default theme which is
registered by the `pageflow:install` generator. The default theme
provides a rich set of SCSS variables, which can be adapted by
basing a custom theme on the default theme.

To add a custom theme to your application, run the following command
inside your Pageflow app directory:

    $ rails generate pageflow:theme my_custom_theme

The generator creates the following files and directories:

    app/
      assets/
        stylesheets/
          pageflow/
            themes/
              my_custom_theme.scss
              my_custom_theme/
                variables.scss
        images/
          pageflow/
            themes/
              my_custom_theme/
                preview.png
                preview_thumbnail.png

Now take a look at the
[available variables](http://codevise.github.io/pageflow/theme/master/)
and start customizing. Pageflow plugins might define their own set of
variables. Refer to the README of the respective plugin for further
information.

To provide editors with more ways to distinguish between themes, you
can add you own preview image and/or preview thumbnail in PNG
format. To support high resolution displays, we advise to stick with
the resolution/aspect ratio of the default sample files `preview.png`
and `preview_thumbnail.png`.

Finally you have to register the theme in the Pageflow initializer:

    # config/initializers/pageflow.rb
    Pageflow.configure do
      config.themes.register(:my_custom_theme)
    end

After restarting the app server, the custom theme can be selected in
the account admin form.

The theme stylesheet `pageflow/themes/my_custom_theme.css` is
automatically added to the list of precompiled assets.

## Common Gotchas

The default `application.scss` provided by Rails contains the
statement `require_tree .`. This causes all stylesheets under
`app/assets/stylesheets` to be included into `application.css` on
asset precompilation. Since your custom theme is precompiled into a
separate css file, this is undesirable and can even lead to "Undefined
Variable" errors during precompilation.

To fix the issue, simply remove the `require_tree` statement and
require each file that you want to include in your `application.css`
individually.
