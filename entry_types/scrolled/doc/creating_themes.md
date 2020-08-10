# Creating Themes

Copy the default theme directory
`app/javascript/pageflow-scrolled/themes/default` to a new directory
with the name of your theme
(e.g. `app/javascript/pageflow-scrolled/themes/my_custom_theme`) and
replace images as needed.

Register the theme in the Pageflow initializer:

    # config/initializers/pageflow.rb
    Pageflow.configure do |config|
      config.for_entry_type(PageflowScrolled.entry_type) do |entry_type_config|
        # ...

        entry_type_config.themes.register(:my_custom_theme,
                                          logo_alt_text: '...')
      end
    end

Copy all options from the default theme and make the desired changes.
