Pageflow.configure do |config|
  config.for_entry_type(PageflowScrolled.entry_type) do |entry_type_config|
    entry_type_config.features.register('hls_instead_of_dash')
  end
end
