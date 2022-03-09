# Configuring Third Party Consent

Set the following theme options to require user consent before loading
third party embeds:

``` ruby
entry_type_config.themes.register(:my_custom_theme,
                                  # ...
                                  third_party_consent: {
                                    cookie_name: 'optIn',
                                    cookie_domain: 'example.com', # optional
                                    opt_out_url: 'https://example.com/privacy'
                                  })
```

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

``` ruby
ntry_type_config.themes.register(:my_custom_theme,
                                 # ...
                                 third_party_consent: {
                                   cookie_name: 'optIn',
                                   cookie_provider_name_mapping: {
                                     video: 'youtube',
                                     datawrapper: 'charts'
                                   },
                                   opt_out_url: 'https://example.com/privacy'
                                 })
```

The given names will be used when reading or writing to the cookie.
