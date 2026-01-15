import I18n from 'i18n-js';
import Marionette from 'backbone.marionette';

import {app} from 'pageflow/editor';
import {cssModulesUtils} from 'pageflow/ui';

import {SelectableEntryOutlineView} from './SelectableEntryOutlineView';
import {dialogView} from './mixins/dialogView';
import dialogViewStyles from './mixins/dialogView.module.css';
import styles from './SelectMoveDestinationDialogView.module.css';

export const SelectMoveDestinationDialogView = Marionette.ItemView.extend({
  template: (data) => `
    <div class="${dialogViewStyles.backdrop}">
      <div class="editor ${dialogViewStyles.box} ${styles.box}">
        <h1 class="${dialogViewStyles.header}">${I18n.t(`pageflow_scrolled.editor.select_move_destination.header_${data.mode}`)}</h1>
        <p class="${dialogViewStyles.hint}">${I18n.t('pageflow_scrolled.editor.select_move_destination.hint')}</p>

        <div class="${styles.outlineContainer}"></div>

        <div class="${dialogViewStyles.footer}">
          <button type="submit" class="${dialogViewStyles.close} ${styles.close}">
            ${I18n.t('pageflow_scrolled.editor.select_move_destination.cancel')}
          </button>
        </div>
      </div>
    </div>
  `,

  ui: cssModulesUtils.ui(styles, 'outlineContainer'),

  mixins: [dialogView],

  serializeData() {
    return {
      mode: this.options.mode
    };
  },

  onRender() {
    const outlineOptions = {
      entry: this.options.entry,
      mode: this.options.mode
    };

    if (this.options.mode === 'insertPosition') {
      outlineOptions.onSelectInsertPosition = result => {
        this.options.onSelect(result);
        this.close();
      };
    }
    else if (this.options.mode === 'sectionPart') {
      outlineOptions.onSelectSectionPart = result => {
        this.options.onSelect(result);
        this.close();
      };
    }
    else {
      outlineOptions.onSelectSection = section => {
        this.options.onSelect(section);
        this.close();
      };
    }

    this.ui.outlineContainer.append(
      this.subview(new SelectableEntryOutlineView(outlineOptions)).el
    );
  }
});

SelectMoveDestinationDialogView.show = function(options) {
  const view = new SelectMoveDestinationDialogView(options);
  app.dialogRegion.show(view.render());
};
