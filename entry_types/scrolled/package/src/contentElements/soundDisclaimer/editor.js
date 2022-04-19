import {editor, NoOptionsHintView} from 'pageflow-scrolled/editor';

import pictogram from './pictogram.svg';

editor.contentElementTypes.register('soundDisclaimer', {
  pictogram,
  category: 'media',
  supportedPositions: ['inline'],

  configurationEditor() {
    this.tab('general', function() {
      this.view(NoOptionsHintView);
    });
  }
});
