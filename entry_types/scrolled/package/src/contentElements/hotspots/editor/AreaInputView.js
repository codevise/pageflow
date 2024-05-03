import Marionette from 'backbone.marionette';
import {buttonStyles} from 'pageflow-scrolled/editor';
import {cssModulesUtils, inputView} from 'pageflow/ui';
import I18n from 'i18n-js';

import {EditAreaDialogView} from './EditAreaDialogView';

import styles from './AreaInputView.module.css';

export const AreaInputView = Marionette.Layout.extend({
  template: (data) => `
    <label>
      <span class="name"></span>
      <span class="inline_help"></span>
    </label>
    <button class="${buttonStyles.targetButton} ${styles.button}">
      ${I18n.t('pageflow_scrolled.editor.content_elements.hotspots.area_input.edit')}
    </button>
  `,

  mixins: [inputView],

  events: cssModulesUtils.events(buttonStyles, {
    'click targetButton': function () {
      EditAreaDialogView.show({
        model: this.model,
        file: this.options.file,
        portraitFile: this.options.portraitFile,
        defaultTab: this.options.defaultTab
      });
    }
  })
});
