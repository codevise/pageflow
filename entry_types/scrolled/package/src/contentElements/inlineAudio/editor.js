import {editor} from 'pageflow-scrolled/editor';
import {FileInputView, CheckBoxInputView} from 'pageflow/editor';
import {SelectInputView, SeparatorView, ColorInputView} from 'pageflow/ui';

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

      this.view(SeparatorView);

      this.input('autoplay', CheckBoxInputView);

      this.input('atmoDuringPlayback', SelectInputView, {
        values: ['play', 'mute', 'turnDown']
      });

      this.view(SeparatorView);

      this.input('playerControlVariant', SelectInputView, {
        values: ['classic', 'waveform', 'waveformLines', 'waveformBars'],
        ensureValueDefined: true
      });

      this.input('waveformColor', ColorInputView, {
        visibleBinding: 'playerControlVariant',
        visible: variant => variant?.startsWith('waveform'),
        defaultValue: entry.getTheme().get('options').colors.accent
      });

      this.view(SeparatorView);

      this.group('ContentElementCaption');
      this.group('ContentElementPosition');
    });
  }
});
