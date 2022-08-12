import I18n from 'i18n-js';
import {editor} from 'pageflow-scrolled/editor';
import {SelectInputView} from 'pageflow/ui';
import {InfoBoxView} from 'pageflow/editor';

editor.contentElementTypes.register('heading', {
  supportedPositions: ['inline', 'wide'],

  defaultConfig: {position: 'wide'},

  configurationEditor({entry}) {
    this.listenTo(this.model, 'change:hyphens', this.refresh);

    this.tab('general', function() {
      this.input('textSize', SelectInputView, {
        values: ['auto', 'large', 'medium', 'small']
      });
      this.group('ContentElementTypographyVariant', {entry});
      this.group('ContentElementPosition');
      this.input('hyphens', SelectInputView, {
        values: ['auto', 'manual']
      });

      if (this.model.get('hyphens') === 'manual') {
        this.view(InfoBoxView, {
          text: I18n.t('pageflow_scrolled.editor.content_elements.heading.help_texts.shortcuts'),
        });
      }
    });
  }
});
