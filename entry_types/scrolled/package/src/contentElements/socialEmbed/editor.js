import {editor} from 'pageflow-scrolled/editor';
import {OembedUrlInputView} from 'pageflow/editor';
import {CheckBoxInputView, SelectInputView} from 'pageflow/ui';
import pictogram from './pictogram.svg'
import {processBlueskyOembed} from './processBlueskyOembed';

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
      this.input('url', OembedUrlInputView, {
        displayPropertyName: 'displayPostId',
        providerNameProperty: 'provider',
        providers: {
          bluesky: {
            supportedHosts: ['bsky.app', 'bsky.social'],
            transform: processBlueskyOembed
          },
          instagram: {
            supportedHosts: ['instagram.com', 'www.instagram.com'],
            skipOembedValidation: true
          },
          x: {
            supportedHosts: ['twitter.com', 'www.twitter.com', 'x.com', 'www.x.com'],
            skipOembedValidation: true
          }
        }
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
