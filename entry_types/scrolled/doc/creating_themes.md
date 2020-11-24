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
                                          logo_alt_text: '...',
                                          logo_url: '...'
                                          theme_color: '#..')
      end
    end

Copy all options from the default theme and make the desired changes.

Place the favicons next to logos in the theme. Please create favicons
according to the devices for performance reasons and replace them with
the default favicons.
This [tool](https://realfavicongenerator.net/) is an example which creates favicons
for all the latest devices.

## Third Party Consent

Set the following theme options to require user consent before loading
third party embeds:

    entry_type_config.themes.register(:my_custom_theme,
                                      # ...
                                      third_party_consent: {
                                        cookie_name: 'optIn',
                                        opt_out_url: 'https://example.com/privacy'
                                      })

Set `cookie_name` to the name of a cookie that contains a serialized
JSON object that controls embeds of which providers should be
displayed:

    {"datawrapper": true, "video": true}

The `datawrapper` key is used for the chart content element. The
`video` key controls whether YouTube and Vimeo videos shall be
displayed. Clicking the consent button in a content element sets the
respective key in the cookie.

If `opt_out_url` is set, an info icon linking to the given URL will
be displayed next to embeds once the user has given consent. The opt
out page is expected to provide opt out facilities.

If your cookie uses different key names, you can configure a custom
mapping:

    entry_type_config.themes.register(:my_custom_theme,
                                      # ...
                                      third_party_consent: {
                                        cookie_name: 'optIn',
                                        cookie_provider_name_mapping: {
                                          video: 'youtube',
                                          datawrapper: 'charts'
                                        },
                                        opt_out_url: 'https://example.com/privacy'
                                      })

The given names will be used when reading or writing to the cookie.
