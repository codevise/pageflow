import Marionette from 'backbone.marionette';
import {t} from 'i18n-js';

import styles from './BlankEntryView.module.css';

export const BlankEntryView = Marionette.ItemView.extend({
  template: () => `
    <div class="blank_entry">
      <h2>${t('pageflow_scrolled.editor.blank_entry.header')}</h2>
      <p>${t('pageflow_scrolled.editor.blank_entry.intro')}</p>
      <ol>
        <li>${t('pageflow_scrolled.editor.blank_entry.create_chapter')}</li>
        <li>${t('pageflow_scrolled.editor.blank_entry.create_section')}</li>
        <li>${t('pageflow_scrolled.editor.blank_entry.create_content_element')}</li>
        <li>${t('pageflow_scrolled.editor.blank_entry.edit_content_element')}</li>
        <li>${t('pageflow_scrolled.editor.blank_entry.edit_section')}</li>
      </ol>
      <p>${t('pageflow_scrolled.editor.blank_entry.outro')}</p>
    </div>
  `,

  className: styles.blankEntry,

  onRender() {
    this.listenTo(this.model.sections, 'add remove', this.update);
    this.update();
  },

  update() {
    this.$el.toggle(!this.model.sections.length);
  }
});
