Pageflow.configure do |config|
  config.plugin(PageflowScrolled.plugin)

  config.for_entry_type(PageflowScrolled.entry_type) do |entry_type_config|
    entry_type_config.themes.register(:default,
                                      stylesheet_packs: ['fonts/sourceSansPro'],
                                      font_family: {
                                        entry: '"Source Sans Pro", sans-serif',
                                        navigation: '"Source Sans Pro", sans-serif'
                                      },
                                      colors: {
                                        accent: '#e10028',
                                        navigation: {
                                          surface: '#fff',
                                          on_surface: '#000',
                                          primary_on_surface: '#00375a',
                                          secondary_on_surface: '#c2c2c2',
                                          background: 'rgba(255, 255, 255, 0.95)',
                                          on_background: '#000',
                                          primary_on_background: '#00375a'
                                        }
                                      },
                                      logo_alt_text: 'Pageflow',
                                      theme_color: '#ffffff')
  end
end
