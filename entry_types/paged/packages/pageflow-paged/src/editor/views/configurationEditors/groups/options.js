import {CheckBoxInputView, ConfigurationEditorTabView, SelectInputView, TextAreaInputView} from 'pageflow/ui';

import {FileInputView, Page} from 'pageflow/editor';
import {features} from 'pageflow/frontend';
import {Atmo} from 'pageflow-paged/frontend';

import {state} from '$state';

ConfigurationEditorTabView.groups.define('options', function(options) {
  var theme = state.entry.getTheme();

  this.input('display_in_navigation', CheckBoxInputView);

  if (theme.supportsEmphasizedPages()) {
    this.input('emphasize_in_navigation', CheckBoxInputView);
  }

  this.group('page_transitions', {propertyName: 'transition'});

  if (features.isEnabled('delayed_text_fade_in')) {
    this.input('delayed_text_fade_in', SelectInputView, {values: Page.delayedTextFadeIn});
  }

  this.input('description', TextAreaInputView, {size: 'short', disableLinks: true});

  this.input('atmo_audio_file_id', FileInputView, {
    collection: state.audioFiles
  });

  if (theme.supportsHideLogoOnPages()) {
    this.input('hide_logo', CheckBoxInputView);
  }

  if (options.canPauseAtmo) {
    this.input('atmo_during_playback', SelectInputView, {
      values: Atmo.duringPlaybackModes
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
