import _ from 'underscore';

import {CheckBoxInputView, ColorInputView, ConfigurationEditorView, SelectInputView, TextAreaInputView, TextInputView} from 'pageflow/ui';

import {FileInputView} from 'pageflow/editor';
import {features} from 'pageflow/frontend';
import {theme} from 'pageflow-paged/frontend';

import {state} from '$state';

ConfigurationEditorView.register('audio', {
  configure: function() {
    this.tab('general', function() {
      this.group('general', {supportsTextPositionCenter: true});

      this.input('additional_title', TextInputView);
      this.input('additional_description', TextAreaInputView, {size: 'short'});
    });

    this.tab('files', function() {
      this.input('audio_file_id', FileInputView, {
        collection: state.audioFiles,
        defaultTextTrackFilePropertyName: 'default_text_track_file_id'
      });
      this.group('background');
      this.input('thumbnail_image_id', FileInputView, {
        collection: state.imageFiles,
        positioning: false
      });
    });

    this.tab('options', function() {
      if (features.isEnabled('waveform_player_controls')) {
        this.input('audio_player_controls_variant', SelectInputView, {
          values: ['default', 'waveform']
        });
      }

      this.input('waveform_color', ColorInputView, {
        visibleBinding: 'audio_player_controls_variant',
        visibleBindingValue: 'waveform',

        defaultValue: theme.mainColor(),
        swatches: usedWaveformColors()
      });

      this.input('autoplay', CheckBoxInputView);
      this.group('options', {canPauseAtmo: true});
    });

    function usedWaveformColors() {
      return _.chain(state.pages.map(function(page) {
        return page.configuration.get('waveform_color');
      })).uniq().compact().value();
    }
  }
});
