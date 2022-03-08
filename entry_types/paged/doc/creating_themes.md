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
[available variables](http://codevise.github.io/pageflow-docs/theme/master/index.html)
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
    Pageflow.configure do |config|
      config.themes.register(:my_custom_theme)
    end

Alternatively, if you wish to offer a selection of themes to editors
of one or more entries or accounts, you can enable the
`selectable_themes` feature and also wrap your theme in a feature:

    # config/initializers/pageflow.rb
    Pageflow.configure do |config|
      config.features.enable_by_default('selectable_themes')

      config.features.register('my_theme_feature') do |feature_config|
        feature_config.themes.register(:my_custom_theme)
      end
    end

You can give different names to your feature and your theme
(cf. `my_theme_feature` vs `my_custom_theme`). In many cases, it makes
sense to use the same names nonetheless.

When using your theme as part of a feature, you might want to add to
your translations along the lines of

    # config/locales/new/theme_translations.en.yml

    en:
      pageflow:
        my_theme_feature:
          feature_name: "Gertrud"-Theme
          name: Gertrud

`feature_name` is for feature selection in the admin, while `name` is
for choosing between themes from the editor.

After restarting the app server, the custom theme can be selected in
the account admin form. If you wrapped it in a feature, you can
activate the feature per entry or per account instead, which will
allow editors to select it from editor mode.

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
