pageflow.ConfigurationEditorView.register('audio', {
  configure: function() {
    this.tab('general', function() {
      this.group('general', {supportsTextPositionCenter: true});

      this.input('additional_title', pageflow.TextInputView);
      this.input('additional_description', pageflow.TextAreaInputView, {size: 'short'});
    });

    this.tab('files', function() {
      this.input('audio_file_id', pageflow.FileInputView, {
        collection: pageflow.audioFiles,
        defaultTextTrackFilePropertyName: 'default_text_track_file_id'
      });
      this.group('background');
      this.input('thumbnail_image_id', pageflow.FileInputView, {
        collection: pageflow.imageFiles,
        positioning: false
      });
    });

    this.tab('options', function() {
      if (pageflow.features.isEnabled('waveform_player_controls')) {
        this.input('audio_player_controls_variant', pageflow.SelectInputView, {
          values: ['default', 'waveform']
        });
      }

      this.input('waveform_color', pageflow.ColorInputView, {
        visibleBinding: 'audio_player_controls_variant',
        visibleBindingValue: 'waveform',

        defaultValue: pageflow.theme.mainColor(),
        swatches: usedWaveformColors()
      });

      this.input('autoplay', pageflow.CheckBoxInputView);
      this.group('options', {canPauseAtmo: true});
    });

    function usedWaveformColors() {
      return _.chain(pageflow.pages.map(function(page) {
        return page.configuration.get('waveform_color');
      })).uniq().compact().value();
    }
  }
});
