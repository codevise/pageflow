import I18n from 'i18n-js';
import {editor} from 'pageflow-scrolled/editor';
import {InfoBoxView} from 'pageflow/editor';
import {SeparatorView, SelectInputView} from 'pageflow/ui'

import pictogram from './pictogram.svg';

editor.contentElementTypes.register('infoTable', {
  pictogram,
  supportedPositions: ['inline', 'side', 'sticky', 'standAlone', 'left', 'right'],
  supportedWidthRange: ['s', 'xl'],

  configurationEditor({entry, contentElement}) {
    this.tab('general', function() {
      this.input('labelColumnAlign', SelectInputView, {
        values: ['auto', 'left', 'center', 'right']
      });
      this.input('valueColumnAlign', SelectInputView, {
        values: ['auto', 'left', 'center', 'right']
      });
      this.group('PaletteColor', {
        propertyName: 'labelColor',
        entry
      });
      this.group('PaletteColor', {
        propertyName: 'valueColor',
        entry
      });

      this.view(SeparatorView);

      this.group('ContentElementPosition', {entry});

      this.view(SeparatorView);

      this.view(InfoBoxView, {
        text: I18n.t(
          'pageflow_scrolled.editor.content_elements.infoTable.help_texts.shortcuts'
        ),
      });
    });
  }
});
