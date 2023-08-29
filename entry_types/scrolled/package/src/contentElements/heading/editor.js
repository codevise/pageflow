import I18n from 'i18n-js';
import {editor} from 'pageflow-scrolled/editor';
import {contentElementWidths} from 'pageflow-scrolled/frontend';
import {SelectInputView, SeparatorView} from 'pageflow/ui';
import {InfoBoxView} from 'pageflow/editor';

import pictogram from './pictogram.svg';

editor.contentElementTypes.register('heading', {
  pictogram,
  supportedPositions: ['inline'],
  supportedWidthRange: ['auto', 'xl'],

  defaultConfig: {width: contentElementWidths.xl, marginTop: 'none'},

  configurationEditor({entry}) {
    this.listenTo(this.model, 'change:hyphens', this.refresh);

    this.tab('general', function() {
      this.input('textSize', SelectInputView, {
        values: ['auto', 'large', 'medium', 'small']
      });
      this.group('ContentElementTypographyVariant', {
        entry,
        getPreviewConfiguration: (configuration, typographyVariant) =>
          ({
            ...configuration,
            textSize: 'small',
            typographyVariant
          })
      });
      this.input('hyphens', SelectInputView, {
        values: ['auto', 'manual']
      });

      if (this.model.get('hyphens') === 'manual') {
        this.view(InfoBoxView, {
          text: I18n.t('pageflow_scrolled.editor.content_elements.heading.help_texts.shortcuts'),
        });
      }

      this.view(SeparatorView);
      this.group('ContentElementPosition');
    });
  }
});
