import {editor} from 'pageflow-scrolled/editor';
import {CheckBoxInputView, SelectInputView, UrlInputView} from 'pageflow/ui';
import {FileInputView} from 'pageflow/editor';

import pictogram from './pictogram.svg';

editor.contentElementTypes.register('videoEmbed', {
  pictogram,
  category: 'media',
  supportedPositions: ['inline', 'sticky', 'left', 'right', 'wide', 'full'],

  configurationEditor() {
    this.tab('general', function() {
      this.input('videoSource', UrlInputView, {
        supportedHosts: [
          'http://youtu.be',
          'https://youtu.be',
          'http://www.youtube.com',
          'https://www.youtube.com',
          'http://vimeo.com',
          'https://vimeo.com',
          'http://www.facebook.com',
          'https://www.facebook.com'
        ],
        displayPropertyName: 'displayVideoSource',
        required: true,
        permitHttps: true
      });
      this.input('posterId', FileInputView, {
        collection: 'image_files',
        fileSelectionHandler: 'contentElementConfiguration',
        positioning: false
      });
      this.input('hideInfo', CheckBoxInputView);
      this.input('hideControls', CheckBoxInputView);
      this.input('aspectRatio', SelectInputView, {
        values: ['wide', 'narrow', 'square', 'portrait']
      });
      this.group('ContentElementCaption');
      this.group('ContentElementPosition');
    });
  }
});
