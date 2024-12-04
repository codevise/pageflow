import I18n from 'i18n-js';
import {editor} from 'pageflow-scrolled/editor';
import {InfoBoxView} from 'pageflow/editor';
import {SeparatorView} from 'pageflow/ui'

import pictogram from './pictogram.svg';

editor.contentElementTypes.register('infoTable', {
  featureName: 'info_table_content_element',
  pictogram,
  supportedPositions: ['inline', 'sticky', 'standAlone', 'left', 'right'],
  supportedWidthRange: ['s', 'xl'],

  configurationEditor({entry, contentElement}) {
    this.tab('general', function() {
      this.group('ContentElementPosition');

      this.view(SeparatorView);

      this.view(InfoBoxView, {
        text: I18n.t(
          'pageflow_scrolled.editor.content_elements.infoTable.help_texts.shortcuts'
        ),
      });
    });
  }
});
