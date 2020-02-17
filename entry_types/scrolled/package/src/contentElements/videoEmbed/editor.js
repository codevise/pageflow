import {editor} from 'pageflow-scrolled/editor';
import {CheckBoxInputView, SelectInputView, TextInputView, UrlInputView} from 'pageflow/ui';

editor.contentElementTypes.register('videoEmbed', {
  configurationEditor() {
    this.tab('general', function() {
      this.input('videoSource', UrlInputView, {
        supportedHosts: [
          'https://youtu.be',
          'https://www.youtube.com',
          'http://www.youtube.com',
          'http://vimeo.com',
          'https://vimeo.com'
        ],
        displayPropertyName: 'videoSource',
        required: true,
        permitHttps: true
      });

      inputForProvider('youtube', this, 'hideInfo', CheckBoxInputView, {
        disabled: true,
        displayUncheckedIfDisabled: true
      });
      inputForProvider('youtube', this, 'hideControls', CheckBoxInputView);

      inputForProvider('vimeo', this, 'hideInfo', CheckBoxInputView);
      inputForProvider('vimeo', this, 'hideControls', CheckBoxInputView, {
        disabled: true,
        displayUncheckedIfDisabled: true
      });

      this.input('caption', TextInputView);

      this.input('position', SelectInputView, {
        values: ['inline', 'sticky', 'full']
      });
    });
  }
});

function inputForProvider(provider, view, propertyName, inputView, options) {
  view.input(propertyName, inputView, _.extend({
    attributeTranslationKeyPrefixes: [
      'pageflow_scrolled.editor.content_elements.videoEmbed.attributes.' + provider,
      'pageflow_scrolled.editor.content_elements.videoEmbed.attributes'
    ],
    visibleBinding: 'videoSource',
    visible: function(url) {
      return providerFromUrl(url) === provider;
    }
  }, options));
};

function providerFromUrl(url) {
  var domain = new URI(url).domain(true);

  if (['youtu.be', 'youtube.com'].indexOf(domain) >= 0) {
    return 'youtube';
  }
  else if (domain === 'vimeo.com') {
    return 'vimeo';
  }

  return '';
};
