Pageflow.configure do |config|
  config.features.register('atmo') do |feature_config|
    feature_config.help_entries.register('pageflow.help_entries.atmo', priority: 7)
  end

  config.features.register('auto_change_page')
  config.features.register('delayed_text_fade_in')
  config.features.register('highdef_video_encoding')
  config.features.register('storylines') do |feature_config|
    feature_config.help_entries.register('pageflow.help_entries.storylines', priority: 7)
  end
end
