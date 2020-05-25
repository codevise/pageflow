import I18n from 'i18n-js';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';

import {app, CollectionView} from 'pageflow/editor';

import {dialogView} from './mixins/dialogView';
import dialogViewStyles from './mixins/dialogView.module.css';
import styles from './InsertContentElementDialogView.module.css';

export const InsertContentElementDialogView = Marionette.ItemView.extend({
  template: () => `
    <div class="${dialogViewStyles.backdrop}">
      <div class="editor ${dialogViewStyles.box} ${styles.box}">
        <h1 class="${dialogViewStyles.header}">${I18n.t('pageflow_scrolled.editor.insert_content_element.header')}</h1>
        <ul class="${styles.list}"></ul>

        <div class="${dialogViewStyles.footer}">
          <button class="${dialogViewStyles.close}">${I18n.t('pageflow_scrolled.editor.insert_content_element.cancel')}</a>
        </div>
      </div>
    </div>
  `,

  ui: {
    items: 'ul'
  },

  mixins: [dialogView],

  events: {
    'click li button': function() {
      this.close();
    }
  },

  onRender() {
    this.subview(new CollectionView({
      el: this.ui.items,
      collection: new Backbone.Collection(this.getSupportedTypes()),
      itemViewConstructor: ItemView,
      itemViewOptions: {
        entry: this.options.entry,
        insertOptions: this.options.insertOptions
      }
    }));
  },

  getSupportedTypes() {
    return this.options.editor.contentElementTypes.getSupported(
      this.options.entry,
      this.options.insertOptions
    )
  }
});

const ItemView = Marionette.ItemView.extend({
  tagName: 'li',
  className: styles.item,

  template: ({displayName}) => `
    <button class="${styles.button}">${displayName}</button>
  `,

  events: {
    'click button': function() {
      this.options.entry.insertContentElement({typeName: this.model.get('typeName')},
                                              this.options.insertOptions);
    }
  }
});

InsertContentElementDialogView.show = function(options) {
  const view = new InsertContentElementDialogView(options);
  app.dialogRegion.show(view.render());
};
