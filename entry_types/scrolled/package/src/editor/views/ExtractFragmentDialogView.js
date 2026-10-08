import I18n from 'i18n-js';
import Marionette from 'backbone.marionette';

import {app} from 'pageflow/editor';
import {cssModulesUtils} from 'pageflow/ui';

import {dialogView} from './mixins/dialogView';
import dialogViewStyles from './mixins/dialogView.module.css';
import styles from './ExtractFragmentDialogView.module.css';

const t = key => I18n.t(`pageflow_scrolled.editor.extract_fragment.${key}`);

export const ExtractFragmentDialogView = Marionette.ItemView.extend({
  template: () => `
    <div class="${dialogViewStyles.backdrop}">
      <form class="editor ${dialogViewStyles.box} ${styles.form}">
        <h1 class="${dialogViewStyles.header}">${t('header')}</h1>

        <label class="${styles.field}">
          <span class="${styles.label}">${t('name')}</span>
          <input type="text" class="${styles.input}">
        </label>

        <div class="info_box info ${styles.hint}">
          ${t('shared_hint')}
        </div>

        <div class="${dialogViewStyles.footer}">
          <button type="submit" class="${styles.submit}">${t('submit')}</button>
          <button type="button" class="${dialogViewStyles.close}">${t('cancel')}</button>
        </div>
      </form>
    </div>
  `,

  ui: cssModulesUtils.ui(styles, 'input'),

  mixins: [dialogView],

  events: cssModulesUtils.events(styles, {
    'submit form': 'submit'
  }),

  onRender() {
    this.ui.input.val(this.options.chapter.configuration.get('title') || '');
  },

  onShow() {
    this.ui.input.focus().select();
  },

  submit(event) {
    event.preventDefault();

    this.options.onSubmit(this.ui.input.val().trim());
    this.close();
  }
});

ExtractFragmentDialogView.show = function(options) {
  app.dialogRegion.show(new ExtractFragmentDialogView(options).render());
};
