import {editor} from 'pageflow-scrolled/editor';
import {FileInputView, CheckBoxInputView} from 'pageflow/editor';
import {SelectInputView, ColorInputView} from 'pageflow/ui';

import pictogram from './pictogram.svg';

editor.contentElementTypes.register('inlineAudio', {
  pictogram,
  category: 'media',
  supportedPositions: ['inline', 'sticky', 'left', 'right', 'full'],

  configurationEditor({entry}) {
    this.tab('general', function() {
      this.input('id', FileInputView, {
        collection: 'audio_files',
        fileSelectionHandler: 'contentElementConfiguration',
        positioning: false,
        defaultTextTrackFilePropertyName: 'defaultTextTrackFileId'
      });

      this.input('posterId', FileInputView, {
        collection: 'image_files',
        fileSelectionHandler: 'contentElementConfiguration',
        positioning: false
      });

      this.input('autoplay', CheckBoxInputView);

      this.input('playerControlVariant', SelectInputView, {
        values: ['classic', 'waveform'],
        ensureValueDefined: true
      });

      this.input('waveformColor', ColorInputView, {
        visibleBinding: 'playerControlVariant',
        visibleBindingValue: 'waveform',
        defaultValue: entry.getTheme().get('options').colors.accent
      });


      this.input('atmoDuringPlayback', SelectInputView, {
        values: ['play', 'mute', 'turnDown']
      });

      this.group('ContentElementCaption');
      this.group('ContentElementPosition');
    });
  }
});
