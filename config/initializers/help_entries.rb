Pageflow.configure do |config|
  config.help_entries.register('pageflow.help_entries.overview', priority: 100)
  config.help_entries.register('pageflow.help_entries.meta_data', priority: 50)
  config.help_entries.register('pageflow.help_entries.files', priority: 40)
  config.help_entries.register('pageflow.help_entries.text_tracks', priority: 35)
  config.help_entries.register('pageflow.help_entries.outline', priority: 30)
  config.help_entries.register('pageflow.help_entries.page_options', priority: 20)
  config.help_entries.register('pageflow.help_entries.atmo', priority: 7)
  config.help_entries.register('pageflow.help_entries.publishing', priority: 5)
end
