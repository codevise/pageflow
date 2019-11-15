import {CheckBoxInputView, ConfigurationEditorTabView, SelectInputView, TextAreaInputView} from '$pageflow/ui';

import {Page} from '../../../models/Page';

import {FileInputView} from '../../inputs/FileInputView';

import {state} from '$state';

ConfigurationEditorTabView.groups.define('options', function(options) {
  var theme = state.entry.getTheme();

  this.input('display_in_navigation', CheckBoxInputView);

  if (theme.supportsEmphasizedPages()) {
    this.input('emphasize_in_navigation', CheckBoxInputView);
  }

  this.group('page_transitions', {propertyName: 'transition'});

  if (pageflow.features.isEnabled('delayed_text_fade_in')) {
    this.input('delayed_text_fade_in', SelectInputView, {values: Page.delayedTextFadeIn});
  }

  this.input('description', TextAreaInputView, {size: 'short', disableLinks: true});

  this.input('atmo_audio_file_id', FileInputView, {
    collection: pageflow.audioFiles
  });

  if (options.canPauseAtmo) {
    this.input('atmo_during_playback', SelectInputView, {
      values: pageflow.Atmo.duringPlaybackModes
    });
  }

  if (theme.supportsScrollIndicatorModes()) {
    this.input('scroll_indicator_mode', SelectInputView, {
      values: Page.scrollIndicatorModes
    });

    this.input('scroll_indicator_orientation', SelectInputView, {
      values: Page.scrollIndicatorOrientations
    });
  }
});
