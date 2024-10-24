import {editor, InlineFileRightsMenuItem} from 'pageflow-scrolled/editor';
import {ColorInputView, FileInputView} from 'pageflow/editor';
import {SliderInputView, TextInputView, SeparatorView} from 'pageflow/ui';

import pictogram from './pictogram.svg';

editor.contentElementTypes.register('inlineBeforeAfter', {
  pictogram,
  category: 'interactive',
  supportedPositions: ['inline', 'sticky', 'standAlone', 'left', 'right', 'backdrop'],
  supportedWidthRange: ['xxs', 'full'],

  configurationEditor({entry}) {
    this.tab('general', function() {
      this.input('before_id', FileInputView, {
        collection: 'image_files',
        fileSelectionHandler: 'contentElementConfiguration',
        positioning: false,
        dropDownMenuItems: [InlineFileRightsMenuItem]
      });
      this.input('before_label', TextInputView);
      this.input('after_id', FileInputView, {
        collection: 'image_files',
        fileSelectionHandler: 'contentElementConfiguration',
        positioning: false,
        dropDownMenuItems: [InlineFileRightsMenuItem]
      });
      this.input('after_label', TextInputView);
      this.input('initial_slider_position', SliderInputView);
      this.input('slider_color', ColorInputView);

      this.group('ContentElementPosition');

      this.view(SeparatorView);

      this.group('ContentElementCaption', {entry});
    });
  },

  defaultConfig: {initial_slider_position: 50},
});
