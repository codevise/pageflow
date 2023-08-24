import {editor} from 'pageflow-scrolled/editor';
import {FileInputView, CheckBoxInputView} from 'pageflow/editor';

import pictogram from './pictogram.svg';

editor.contentElementTypes.register('inlineImage', {
  pictogram,
  category: 'media',
  supportedPositions: ['inline', 'sticky', 'left', 'right'],
  supportedWidthRange: ['xxs', 'xxl'],

  configurationEditor() {
    this.tab('general', function() {
      this.input('id', FileInputView, {
        collection: 'image_files',
        fileSelectionHandler: 'contentElementConfiguration',
        positioning: false
      });
      this.input('portraitId', FileInputView, {
        collection: 'image_files',
        fileSelectionHandler: 'contentElementConfiguration',
        positioning: false
      });
      this.input('enableFullscreen', CheckBoxInputView, {
        disabledBinding: 'position',
        disabledBindingValue: 'full',
        displayUncheckedIfDisabled: true
      });
      this.group('ContentElementPosition');
    });
  }
});
