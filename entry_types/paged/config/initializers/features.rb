Pageflow.configure do |config|
  config.for_entry_type(PageflowPaged.entry_type) do |entry_type_config|
    entry_type_config.features.register('highdef_background_images')

    entry_type_config.features.register('auto_change_page')
    entry_type_config.features.register('delayed_text_fade_in')

    entry_type_config.features.register('storylines') do |feature_config|
      feature_config.help_entries.register('pageflow_paged.help_entries.storylines', priority: 7)
    end

    entry_type_config.features.register('editor_emulation_mode')
    entry_type_config.features.register('waveform_player_controls')
    entry_type_config.features.register('structured_data')
    entry_type_config.features.register('page_level_caching')

    entry_type_config.features.enable_by_default('structured_data')
    entry_type_config.features.enable_by_default('page_level_caching')
  end
end
