Pageflow.configure do |c|
  c.for_entry_type(PageflowPaged.entry_type) do |config|
    config.help_entries.register('pageflow_paged.help_entries.overview', priority: 100)

    config.help_entries.register('pageflow_paged.help_entries.meta_data', priority: 50)
    config.help_entries.register('pageflow.help_entries.meta_data.general',
                                 priority: 100, parent: 'pageflow_paged.help_entries.meta_data')
    config.help_entries.register('pageflow_paged.help_entries.meta_data.appearance',
                                 priority: 75, parent: 'pageflow_paged.help_entries.meta_data')
    config.help_entries.register('pageflow.help_entries.meta_data.social',
                                 priority: 50, parent: 'pageflow_paged.help_entries.meta_data')

    config.help_entries.register('pageflow_paged.help_entries.outline', priority: 30)
    config.help_entries.register('pageflow_paged.help_entries.page_options', priority: 20)
    config.help_entries.register('pageflow_paged.help_entries.atmo', priority: 7)
  end
end
