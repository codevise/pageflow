import {editor} from 'pageflow-scrolled/editor';
import {FileInputView, CheckBoxInputView} from 'pageflow/editor';
import {SelectInputView} from 'pageflow/ui';

import pictogram from './pictogram.svg';

editor.contentElementTypes.register('inlineVideo', {
  pictogram,
  category: 'media',
  supportedPositions: ['inline', 'sticky', 'left', 'right', 'wide', 'full'],

  configurationEditor() {
    this.tab('general', function() {
      this.input('id', FileInputView, {
        collection: 'video_files',
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

      this.input('atmoDuringPlayback', SelectInputView, {
        values: ['play', 'mute', 'turnDown']
      });

      this.group('ContentElementCaption');
      this.group('ContentElementPosition');
    });
  }
});
