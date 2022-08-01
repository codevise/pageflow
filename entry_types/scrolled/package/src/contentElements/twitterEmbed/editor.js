import {editor} from 'pageflow-scrolled/editor';
import {TextInputView, CheckBoxInputView} from 'pageflow/ui';
import pictogram from './pictogram.svg'

editor.contentElementTypes.register('twitterEmbed', {
  pictogram,
  category: 'media',
  supportedPositions: ['inline', 'sticky', 'left', 'right', 'wide', 'full'],
  
  configurationEditor() {
    this.tab('general', function() {
      this.input('tweetId', TextInputView, {
        displayPropertyName: 'displayTweetId',
        required: true,
      });
      this.group('ContentElementPosition');
      this.input('hideConversation', CheckBoxInputView);
      this.input('hideMedia', CheckBoxInputView);
    });
  },
  defaultConfig: {caption: 'Add caption here'},
});