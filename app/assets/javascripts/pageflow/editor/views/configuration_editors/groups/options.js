pageflow.ConfigurationEditorTabView.groups.define('options', function(options) {
  var theme = pageflow.entry.getTheme();

  this.input('display_in_navigation', pageflow.CheckBoxInputView);

  if (theme.supportsEmphasizedPages()) {
    this.input('emphasize_in_navigation', pageflow.CheckBoxInputView);
  }

  this.group('page_transitions', {propertyName: 'transition'});

  if (pageflow.features.isEnabled('delayed_text_fade_in')) {
    this.input('delayed_text_fade_in', pageflow.SelectInputView, {values: pageflow.Page.delayedTextFadeIn});
  }

  this.input('description', pageflow.TextAreaInputView, {size: 'short', disableLinks: true});

  this.input('atmo_audio_file_id', pageflow.FileInputView, {
    collection: pageflow.audioFiles
  });

  if (options.canPauseAtmo) {
    this.input('atmo_during_playback', pageflow.SelectInputView, {
      values: pageflow.Atmo.duringPlaybackModes
    });
  }

  if (theme.supportsScrollIndicatorModes()) {
    this.input('scroll_indicator_mode', pageflow.SelectInputView, {
      values: pageflow.Page.scrollIndicatorModes
    });

    this.input('scroll_indicator_orientation', pageflow.SelectInputView, {
      values: pageflow.Page.scrollIndicatorOrientations
    });
  }
});
