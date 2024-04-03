import {editor} from 'pageflow-scrolled/editor';
import {UrlInputView} from 'pageflow/ui';
import pictogram from './pictogram.svg'

editor.contentElementTypes.register('tikTokEmbed', {
  pictogram,
  category: 'media',
  supportedPositions: ['inline', 'sticky', 'standAlone', 'left', 'right'],

  configurationEditor() {
    this.tab('general', function() {
      this.input('url', UrlInputView, {
        supportedHosts: [
          'https://www.tiktok.com',
        ],
        displayPropertyName: 'displayUrl',
        required: true,
        permitHttps: true
      });
      this.group('ContentElementPosition');
    });
  },
  defaultConfig: {},
});
