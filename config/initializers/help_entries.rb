Pageflow.configure do |config|
  config.help_entries.register('pageflow.help_entries.overview', priority: 100)
  config.help_entries.register('pageflow.help_entries.meta_data', priority: 50)
  config.help_entries.register('pageflow.help_entries.files', priority: 40)
  config.help_entries.register('pageflow.help_entries.text_tracks', priority: 35)
  config.help_entries.register('pageflow.help_entries.outline', priority: 30)
  config.help_entries.register('pageflow.help_entries.page_options', priority: 20)
  config.help_entries.register('pageflow.help_entries.page_types', priority: 10)

  config.help_entries.register('pageflow.help_entries.publishing', priority: 5)
end

Pageflow.after_configure do |config|
  config.page_types.each do |page_type|
    config.help_entries.register(page_type.help_entry_translation_key,
                                 parent: 'pageflow.help_entries.page_types')
  end
end
