import {editor} from 'pageflow-scrolled/editor';
import {UrlInputView, CheckBoxInputView} from 'pageflow/ui';
import pictogram from './pictogram.svg'

editor.contentElementTypes.register('twitterEmbed', {
  pictogram,
  category: 'media',
  supportedPositions: ['inline', 'side', 'sticky', 'standAlone', 'left', 'right'],

  configurationEditor({entry}) {
    this.tab('general', function() {
      this.input('url', UrlInputView, {
        supportedHosts: [
          'http://twitter.com',
          'https://twitter.com',
          'http://x.com',
          'https://x.com'
        ],
        displayPropertyName: 'displayTweetId',
        required: true,
        permitHttps: true
      });
      this.group('ContentElementPosition', {entry});
      this.input('hideConversation', CheckBoxInputView);
      this.input('hideMedia', CheckBoxInputView);
    });
  },
  defaultConfig: {caption: 'Add caption here'},
});
