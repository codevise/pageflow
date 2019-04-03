Pageflow.configure do |config|
  config.features.register('auto_change_page')
  config.features.register('delayed_text_fade_in')
  config.features.register('highdef_video_encoding')
  config.features.register('storylines') do |feature_config|
    feature_config.help_entries.register('pageflow.help_entries.storylines', priority: 7)
  end
  config.features.register('selectable_themes')
  config.features.register('editor_emulation_mode')
  config.features.register('waveform_player_controls')
  config.features.register('structured_data')

  config.features.enable_by_default('structured_data')
end
