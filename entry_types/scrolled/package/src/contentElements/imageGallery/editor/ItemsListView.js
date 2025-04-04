import Marionette from 'backbone.marionette';
import {editor, buttonStyles} from 'pageflow-scrolled/editor';
import {ListView} from 'pageflow/editor';
import {cssModulesUtils} from 'pageflow/ui';
import I18n from 'i18n-js';

import styles from './ItemsListView.module.css';

export const ItemsListView = Marionette.Layout.extend({
  template: (data) => `
    <div class='${styles.listContainer}'></div>
    <button class="${buttonStyles.addButton}">
      ${I18n.t('pageflow_scrolled.editor.content_elements.imageGallery.items.add')}
    </button>
  `,

  regions: cssModulesUtils.ui(styles, 'listContainer'),

  events: cssModulesUtils.events(buttonStyles, {
    'click addButton': function () {
      this.collection.selectImage();
    }
  }),

  onRender() {
    this.listContainer.show(new ListView({
      label: I18n.t('pageflow_scrolled.editor.content_elements.imageGallery.items.label'),
      collection: this.collection,
      sortable: true,

      onEdit: (model) => {
        editor.navigate(
          `/scrolled/imageGalleries/${this.options.contentElement.id}/${model.id}`,
          {trigger: true}
        )
      },
      onRemove: (model) => this.collection.remove(model)
    }));
  }
});
