import {editor, InlineFileRightsMenuItem} from 'pageflow-scrolled/editor';
import {FileInputView, CheckBoxInputView} from 'pageflow/editor';
import {SelectInputView, SeparatorView, ColorInputView} from 'pageflow/ui';
import I18n from 'i18n-js';

import {
  defaultRemainingWaveformColor,
  defaultRemainingWaveformColorInverted,
  defaultWaveformCursorColor,
  defaultWaveformCursorColorInverted
} from '../../frontend/PlayerControls/WaveformPlayerControls/defaultColors';

import pictogram from './pictogram.svg';

editor.contentElementTypes.register('inlineAudio', {
  pictogram,
  category: 'media',
  supportedPositions: ['inline', 'side', 'sticky', 'standAlone', 'left', 'right'],
  supportedWidthRange: ['xxs', 'full'],
  supportedStyles: [
    {
      name: 'boxShadow',
      when: posterId => !!posterId,
      binding: 'posterId'
    },
    'outline'
  ],

  defaultConfig: {playerControlVariant: 'waveformBars'},

  defaultsInputs() {
    this.input('autoplay', CheckBoxInputView);
    this.input('playerControlVariant', SelectInputView, {
      values: ['waveformBars', 'waveformLines', 'waveform', 'classic']
    });
  },

  configurationEditor({entry, contentElement}) {
    const themeProperties = entry.getThemeProperties();
    const invert = contentElement.section.configuration.get('invert');

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
        alpha: true,
        visibleBinding: 'playerControlVariant',
        visible: variant => variant?.startsWith('waveform'),
        defaultValue: themeProperties.root?.accentColor ||
                      themeProperties.colors?.accent,
        swatches: entry.getUsedContentElementColors('waveformColor')
      });

      this.input('remainingWaveformColor', ColorInputView, {
        alpha: true,
        visibleBinding: 'playerControlVariant',
        visible: variant => variant?.startsWith('waveform'),
        placeholder: I18n.t('pageflow_scrolled.editor.content_elements.inlineAudio.attributes.remainingWaveformColor.auto'),
        placeholderColor: invert ? defaultRemainingWaveformColorInverted
                                 : defaultRemainingWaveformColor,
        swatches: entry.getUsedContentElementColors('remainingWaveformColor')
      });

      this.input('waveformCursorColor', ColorInputView, {
        alpha: true,
        visibleBinding: 'playerControlVariant',
        visible: variant => variant?.startsWith('waveform'),
        placeholder: I18n.t('pageflow_scrolled.editor.content_elements.inlineAudio.attributes.waveformCursorColor.auto'),
        placeholderColor: invert ? defaultWaveformCursorColorInverted
                                 : defaultWaveformCursorColor,
        swatches: entry.getUsedContentElementColors('waveformCursorColor')
      });

      this.input('invertPlayButton', CheckBoxInputView, {
        visibleBinding: 'playerControlVariant',
        visible: variant => variant?.startsWith('waveform')
      });

      this.view(SeparatorView);

      this.group('ContentElementPosition', {entry});

      this.view(SeparatorView);

      this.group('ContentElementCaption', {entry});
      this.group('ContentElementInlineFileRightsSettings');
    });
  }
});
