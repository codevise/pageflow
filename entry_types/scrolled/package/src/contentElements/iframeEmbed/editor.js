import {editor} from 'pageflow-scrolled/editor';
import {TextInputView, SelectInputView} from 'pageflow/ui';

const aspectRatios = ['wide', 'narrow', 'square', 'portrait'];

editor.contentElementTypes.register('iframeEmbed', {
  featureName: 'iframe_embed_content_element',
  supportedPositions: ['inline', 'sticky', 'left', 'right', 'wide', 'full'],

  configurationEditor() {
    this.tab('general', function() {
      this.input('source', TextInputView);
      this.input('title', TextInputView);
      this.input('aspectRatio', SelectInputView, {
        values: aspectRatios
      });
      this.input('portraitAspectRatio', SelectInputView, {
        includeBlank: true,
        blankTranslationKey: 'pageflow_scrolled.editor.' +
                             'content_elements.iframeEmbed.' +
                             'attributes.portraitAspectRatio.blank',
        values: aspectRatios
      });
      this.input('scale', SelectInputView, {
        values: ['p100', 'p75', 'p50', 'p33']
      });
      this.group('ContentElementCaption');
      this.group('ContentElementPosition');
    });
  }
});
