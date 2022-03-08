# Creating Themes

Copy the default theme directory
`app/javascript/pageflow-scrolled/themes/default` to a new directory
with the name of your theme
(e.g. `app/javascript/pageflow-scrolled/themes/my_custom_theme`) and
replace images as needed. The favicons of the default theme have been
generated using
[realfavicongenerator.net](https://realfavicongenerator.net/).

Register the theme in the theme plugin created by the
`pageflow_scrolled:install` generator:

``` ruby
# app/plugins/scrolled_themes_plugin.rb
class ScrolledThemesPlugin
  def configure(config) # rubocop:disable Metrics/MethodLength
    config.for_entry_type(PageflowScrolled.entry_type) do |entry_type_config|
      # ...

      entry_type_config.themes.register(:my_custom_theme,
                                        # ...)
    end
  end
end
```

Copy all options from the default theme and make the desired changes.

The following aspects can be configured:

* [Custom Typography](./creating_themes/custom_typography.md)
* [Custom Colors and Dimensions](./creating_themes/custom_colors_and_dimensions.md)
* [Custom Icons](./creating_themes/custom_icons.md)
* [Configuring Third Party Consent](./creating_themes/configuring_third_party_consent.md)
