import I18n from 'i18n-js';
import {editor} from 'pageflow-scrolled/editor';
import {InfoBoxView} from 'pageflow/editor';
import {TextInputView, SelectInputView, CheckBoxInputView, SeparatorView} from 'pageflow/ui';

import pictogram from './pictogram.svg';

const aspectRatios = ['wide', 'narrow', 'square', 'portrait'];

editor.contentElementTypes.register('iframeEmbed', {
  pictogram,
  category: 'interactive',
  featureName: 'iframe_embed_content_element',
  supportedPositions: ['inline', 'side', 'sticky', 'standAlone', 'left', 'right'],
  supportedWidthRange: ['xxs', 'full'],

  configurationEditor({entry}) {
    this.tab('general', function() {
      this.input('source', TextInputView);
      this.input('requireConsent', CheckBoxInputView);
      this.view(InfoBoxView, {
        level: 'error',
        text: I18n.t(
          'pageflow_scrolled.editor.content_elements.iframeEmbed.help_texts.missingConsentVendor'
        ),
        visibleBinding: ['source', 'requireConsent'],
        visible: ([source, requireConsent]) =>
          source && requireConsent && !entry.consentVendors.fromUrl(source),
      });
      this.input('title', TextInputView);
      this.input('aspectRatio', SelectInputView, {
        values: aspectRatios,
        disabledBinding: 'autoResize'
      });
      this.input('portraitAspectRatio', SelectInputView, {
        includeBlank: true,
        blankTranslationKey: 'pageflow_scrolled.editor.' +
                             'content_elements.iframeEmbed.' +
                             'attributes.portraitAspectRatio.blank',
        values: aspectRatios,
        disabledBinding: 'autoResize'
      });
      this.input('autoResize', CheckBoxInputView);
      this.view(InfoBoxView, {
        level: 'info',
        text: I18n.t(
          'pageflow_scrolled.editor.content_elements.iframeEmbed.help_texts.autoResize'
        ),
        visibleBinding: 'autoResize'
      });
      this.input('scale', SelectInputView, {
        values: ['p100', 'p75', 'p50', 'p33']
      });
      this.group('ContentElementPosition', {entry});
      this.view(SeparatorView);
      this.group('ContentElementCaption', {entry});
    });
  }
});
