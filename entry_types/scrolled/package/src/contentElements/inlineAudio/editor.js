import {editor, InlineFileRightsMenuItem} from 'pageflow-scrolled/editor';
import {FileInputView, CheckBoxInputView} from 'pageflow/editor';
import {SelectInputView, SeparatorView, ColorInputView} from 'pageflow/ui';

import pictogram from './pictogram.svg';

editor.contentElementTypes.register('inlineAudio', {
  pictogram,
  category: 'media',
  supportedPositions: ['inline', 'side', 'sticky', 'standAlone', 'left', 'right'],
  supportedWidthRange: ['xxs', 'full'],

  defaultConfig: {playerControlVariant: 'waveformBars'},

  configurationEditor({entry}) {
    const themeOptions = entry.getTheme().get('options');

    this.tab('general', function() {
      this.input('id', FileInputView, {
        collection: 'audio_files',
        fileSelectionHandler: 'contentElementConfiguration',
        positioning: false,
        defaultTextTrackFilePropertyName: 'defaultTextTrackFileId',
        dropDownMenuItems: [InlineFileRightsMenuItem]
      });

      this.input('posterId', FileInputView, {
        collection: 'image_files',
        fileSelectionHandler: 'contentElementConfiguration',
        positioning: false,
        dropDownMenuItems: [InlineFileRightsMenuItem]
      });

      this.view(SeparatorView);

      this.input('autoplay', CheckBoxInputView);

      this.input('atmoDuringPlayback', SelectInputView, {
        values: ['play', 'mute', 'turnDown']
      });

      this.view(SeparatorView);

      this.input('playerControlVariant', SelectInputView, {
        values: ['waveformBars', 'waveformLines', 'waveform', 'classic'],
        ensureValueDefined: true
      });

      this.input('waveformColor', ColorInputView, {
        visibleBinding: 'playerControlVariant',
        visible: variant => variant?.startsWith('waveform'),
        defaultValue: themeOptions.properties?.root?.accent_color ||
                      themeOptions.colors?.accent
      });

      this.view(SeparatorView);

      this.group('ContentElementPosition');

      this.view(SeparatorView);

      this.group('ContentElementCaption', {entry});
      this.group('ContentElementInlineFileRightsSettings');
    });
  }
});
