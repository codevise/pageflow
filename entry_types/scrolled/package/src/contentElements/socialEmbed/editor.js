import {editor} from 'pageflow-scrolled/editor';
import {UrlInputView, CheckBoxInputView, SelectInputView} from 'pageflow/ui';
import pictogram from './pictogram.svg'

editor.contentElementTypes.register('socialEmbed', {
  pictogram,
  category: 'media',
  supportedPositions: ['inline', 'side', 'sticky', 'standAlone', 'left', 'right'],
  featureName: 'social_embed_content_element',

  configurationEditor({entry}) {
    this.tab('general', function() {
      this.input('provider', SelectInputView, {
        values: ['x', 'instagram', 'bluesky']
      });
      this.input('url', UrlInputView, {
        displayPropertyName: 'displayPostId',
        permitHttps: true
      });
      this.group('ContentElementPosition', {entry});
      this.input('hideConversation', CheckBoxInputView, {
        visibleBinding: 'provider',
        visibleBindingValue: 'x'
      });
      this.input('hideMedia', CheckBoxInputView, {
        visibleBinding: 'provider',
        visibleBindingValue: 'x'
      });
    });
  },
});
