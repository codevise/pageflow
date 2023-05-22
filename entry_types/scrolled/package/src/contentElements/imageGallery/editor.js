import {editor} from 'pageflow-scrolled/editor';

import pictogram from './pictogram.svg';

editor.contentElementTypes.register('imageGallery', {
  pictogram,
  category: 'media',
  featureName: 'image_gallery_content_element',
  supportedPositions: ['inline', 'sticky', 'left', 'right', 'wide', 'full'],

  configurationEditor() {
    this.tab('general', function() {
      this.group('ContentElementPosition');
    });
  }
});
