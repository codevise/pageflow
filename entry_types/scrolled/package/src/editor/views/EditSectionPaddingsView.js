import {EditConfigurationView} from 'pageflow/editor';
import {SelectInputView} from 'pageflow/ui';

import styles from './EditSectionPaddingsView.module.css';

export const EditSectionPaddingsView = EditConfigurationView.extend({
  translationKeyPrefix: 'pageflow_scrolled.editor.edit_section_paddings',
  hideDestroyButton: true,

  className: styles.view,

  goBackPath() {
    return `/scrolled/sections/` + this.model.get('id')
  },

  configure: function(configurationEditor) {
    const entry = this.options.entry;

    const [paddingTopValues, paddingTopTexts] = entry.getScale('sectionPaddingTop');
    const [paddingBottomValues, paddingBottomTexts] = entry.getScale('sectionPaddingBottom');

    configurationEditor.tab('sectionPaddings', function() {
      this.input('paddingTop', SelectInputView, {
        includeBlank: true,
        values: paddingTopValues,
        texts: paddingTopTexts
      });

      this.input('paddingBottom', SelectInputView, {
        includeBlank: true,
        values: paddingBottomValues,
        texts: paddingBottomTexts
      });
    });
    configurationEditor.tab('portrait', function() {
      this.input('portraitPaddingTop', SelectInputView, {
        includeBlank: true,
        values: paddingTopValues,
        texts: paddingTopTexts
      });

      this.input('portraitPaddingBottom', SelectInputView, {
        includeBlank: true,
        values: paddingBottomValues,
        texts: paddingBottomTexts
      });
    });
  }
});
