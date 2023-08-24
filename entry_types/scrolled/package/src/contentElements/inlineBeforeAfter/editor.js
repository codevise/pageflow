import {editor} from 'pageflow-scrolled/editor';
import {ColorInputView, FileInputView} from 'pageflow/editor';
import {SliderInputView, TextInputView} from 'pageflow/ui';

import pictogram from './pictogram.svg';

editor.contentElementTypes.register('inlineBeforeAfter', {
  pictogram,
  category: 'interactive',
  supportedPositions: ['inline', 'sticky', 'left', 'right'],
  supportedWidthRange: ['xxs', 'xxl'],

  configurationEditor() {
    this.tab('general', function() {
      this.input('before_id', FileInputView, {
        collection: 'image_files',
        fileSelectionHandler: 'contentElementConfiguration',
        positioning: false,
      });
      this.input('before_label', TextInputView);
      this.input('after_id', FileInputView, {
        collection: 'image_files',
        fileSelectionHandler: 'contentElementConfiguration',
        positioning: false,
      });
      this.input('after_label', TextInputView);
      this.input('initial_slider_position', SliderInputView);
      this.input('slider_color', ColorInputView);

      this.group('ContentElementPosition');
    });
  },

  defaultConfig: {initial_slider_position: 50},
});
