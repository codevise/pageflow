import Marionette from 'backbone.marionette';
import {editor, buttonStyles} from 'pageflow-scrolled/editor';
import {ListView} from 'pageflow/editor';
import {cssModulesUtils} from 'pageflow/ui';
import I18n from 'i18n-js';

import {EditAreaDialogView} from './EditAreaDialogView';
import {Area} from './models/Area';

import styles from './AreasListView.module.css';

export const AreasListView = Marionette.Layout.extend({
  template: (data) => `
    <div class='${styles.listContainer}'></div>
    <button class="${buttonStyles.addButton}">
      ${I18n.t('pageflow_scrolled.editor.content_elements.hotspots.areas.add')}
    </button>
  `,

  regions: cssModulesUtils.ui(styles, 'listContainer'),

  events: cssModulesUtils.events(buttonStyles, {
    'click addButton': function () {
      const model = new Area();

      EditAreaDialogView.show({
        model,
        file: this.model.getImageFile('image'),
        portraitFile: this.model.getImageFile('portraitImage'),
        onSave: () => this.collection.addWithId(model)
      });
    }
  }),

  onRender() {
    this.listContainer.show(new ListView({
      label: I18n.t('pageflow_scrolled.editor.content_elements.hotspots.areas.label'),
      collection: this.collection,
      sortable: true,

      onEdit: (model) => editor.navigate(
        `/scrolled/hotspots/${this.options.contentElement.id}/${model.id}`,
        {trigger: true}
      ),
      onRemove: (model) => {
        if (window.confirm(I18n.t('pageflow_scrolled.editor.content_elements.hotspots.areas.confirm_delete'))) {
          this.collection.remove(model);
        }
      }
    }));
  }
});
