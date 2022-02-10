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

## Custom Fonts

[Fontsource](https://github.com/fontsource/fontsource) is the
recommended way to load custom fonts. Add the npm package for the
font:

    $ yarn add @fontsource/open-sans

Create a Webpacker entry point file for your font:

    /* app/javascript/packs/fonts/openSans.css */
    @import "@fontsource/open-sans/400.css";
    @import "@fontsource/open-sans/700.css";

Adjust theme options to load the font stylesheet pack and set the font
family properties:

    entry_type_config.themes.register(:my_custom_theme,
                                      # ...
                                      stylesheet_packs: ['font/openSans'],
                                      font_family: {
                                        entry: '"Open Sans", sans-serif',
                                        navigation: '"Open Sans", sans-serif'
                                      })

## Custom Icons

To use custom icons for buttons like "Share" and "Unmute" in
navigation bars, add a `custom_icons` option when registering the
theme and list the names of the icon you want to customize.

    entry_type_config.themes.register(:my_custom_theme,
                                      # ...
                                      custom_icons: [:information,
                                                     :muted,
                                                     :unmuted,
                                                     :share])

Pageflow will expect to find the icons under paths of the form
`app/javascript/pageflow-scrolled/themes/my_custom_theme/icons/information.svg`. The
`svg` tag in each of these SVG files needs to have an `id` attribute
with value `icon`.

## Third Party Consent

Set the following theme options to require user consent before loading
third party embeds:

    entry_type_config.themes.register(:my_custom_theme,
                                      # ...
                                      third_party_consent: {
                                        cookie_name: 'optIn',
                                        cookie_domain: 'example.com', # optional
                                        opt_out_url: 'https://example.com/privacy'
                                      })

Set `cookie_name` to the name of a cookie that contains a serialized
JSON object that controls embeds of which providers should be
displayed:

    {"datawrapper": true, "video": true}

The `datawrapper` key is used for the chart content element. The
`video` key controls whether YouTube and Vimeo videos shall be
displayed. Clicking the consent button in a content element sets the
respective key in the cookie. If the entry is published under a
sub-domain, but you want the cookie to be set for the parent domain,
specifcy the `cookie_domain` option.

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
