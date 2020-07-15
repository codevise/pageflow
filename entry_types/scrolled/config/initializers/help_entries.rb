Pageflow.configure do |c|
  c.for_entry_type(PageflowScrolled.entry_type) do |config|
    config.help_entries.register('pageflow_scrolled.help_entries.overview', priority: 100)

    config.help_entries.register('pageflow_scrolled.help_entries.meta_data', priority: 50)
    config.help_entries.register('pageflow.help_entries.meta_data.general',
                                 priority: 100, parent: 'pageflow_scrolled.help_entries.meta_data')
    config.help_entries.register('pageflow.help_entries.meta_data.social',
                                 priority: 50, parent: 'pageflow_scrolled.help_entries.meta_data')

    config.help_entries.register('pageflow_scrolled.help_entries.outline', priority: 30)
    config.help_entries.register('pageflow_scrolled.help_entries.sections', priority: 20)
    config.help_entries.register('pageflow_scrolled.help_entries.content_elements', priority: 10)
  end
end
