import I18n from 'i18n-js';
import Marionette from 'backbone.marionette';

import {buttonStyles, dialogView, dialogViewStyles} from 'pageflow-scrolled/editor'
import {app, cssModulesUtils} from 'pageflow/editor';
import {TabsView} from 'pageflow/ui';

import {DraggableEditorView} from './DraggableEditorView';

import styles from '../EditAreaDialogView.module.css';

const i18nPrefix = 'pageflow_scrolled.editor.content_elements.hotspots.edit_area_dialog';

export const EditAreaDialogView = Marionette.ItemView.extend({
  template: () => `
    <div class="${dialogViewStyles.backdrop}">
      <div class="editor ${dialogViewStyles.box} ${styles.box}">
        <h1 class="${dialogViewStyles.header}">
          ${I18n.t(`${i18nPrefix}.header`)}
        </h1>

        <div class="${styles.wrapper}">
        </div>

        <div class="${dialogViewStyles.footer}">
          <button class="${styles.save} ${buttonStyles.saveButton}">
            ${I18n.t(`${i18nPrefix}.save`)}
          </button>
          <button class="${dialogViewStyles.close}">
            ${I18n.t(`${i18nPrefix}.cancel`)}
          </button>
        </div>
     </div>
  </div>
            `,

  mixins: [dialogView],

  ui: cssModulesUtils.ui(styles, 'wrapper'),

  events: cssModulesUtils.events(styles, {
    'click save': function() {
      this.save();
      this.close();

      if (this.options.onSave) {
        this.options.onSave();
      }
    }
  }),

  onRender() {
    if (this.options.portraitFile) {
      const tabsView = new TabsView({
        translationKeyPrefixes: [`${i18nPrefix}.tabs`],
        defaultTab: this.options.defaultTab
      });

      this.editorViews = [
        new DraggableEditorView({
          model: this.model,
          file: this.options.file,
        }),
        new DraggableEditorView({
          model: this.model,
          file: this.options.portraitFile,
          portrait: true
        })
      ];

      tabsView.tab('default', () => this.editorViews[0]);
      tabsView.tab('portrait', () => this.editorViews[1]);

      this.appendSubview(tabsView.render(), {to: this.ui.wrapper});
    }
    else {
      this.editorViews = [
        new DraggableEditorView({
          model: this.model,
          file: this.options.file
        })
      ];

      this.appendSubview(this.editorViews[0].render(), {to: this.ui.wrapper});
    }
  },

  save() {
    this.editorViews.forEach(view => view.save());
  }
});

EditAreaDialogView.show = function(options) {
  app.dialogRegion.show(new EditAreaDialogView(options));
};
