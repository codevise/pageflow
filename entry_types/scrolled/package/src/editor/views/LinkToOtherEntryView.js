import I18n from 'i18n-js';
import Marionette from 'backbone.marionette';

import {cssModulesUtils, CheckBoxInputView} from 'pageflow/ui';

import {EntrySelectView} from './EntrySelectView';
import styles from './LinkToOtherEntryView.module.css';

export const LinkToOtherEntryView = Marionette.ItemView.extend({
  className: styles.view,

  template: () => `
    <div class="${styles.entrySelectContainer}"></div>
    <div class="${styles.openInNewTabContainer}"></div>
  `,

  ui: cssModulesUtils.ui(styles, 'entrySelectContainer', 'openInNewTabContainer'),

  onRender() {
    this.appendSubview(new EntrySelectView({
      collection: this.options.entry.linkableEntries,
      selectedEntryId: this.model.get('entryId'),
      label: I18n.t('pageflow_scrolled.editor.select_link_destination.story'),
      onSelect: linkableEntry => this.selectEntry(linkableEntry)
    }), {to: this.ui.entrySelectContainer});

    this.appendSubview(new CheckBoxInputView({
      model: this.model,
      propertyName: 'openInNewTab',
      label: I18n.t('pageflow_scrolled.editor.select_link_destination.open_in_new_tab')
    }), {to: this.ui.openInNewTabContainer});
  },

  selectEntry(linkableEntry) {
    this.model.set({
      entryId: linkableEntry?.id,
      signature: linkableEntry?.get('signature')
    });
  }
});
