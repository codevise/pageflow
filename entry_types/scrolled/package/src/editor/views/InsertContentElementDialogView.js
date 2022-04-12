import I18n from 'i18n-js';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';

import {app, CollectionView} from 'pageflow/editor';
import {cssModulesUtils} from 'pageflow/ui';

import {dialogView} from './mixins/dialogView';
import dialogViewStyles from './mixins/dialogView.module.css';
import styles from './InsertContentElementDialogView.module.css';

import defaultPictogram from './images/defaultPictogram.svg';

export const InsertContentElementDialogView = Marionette.ItemView.extend({
  template: () => `
    <div class="${dialogViewStyles.backdrop}">
      <div class="editor ${dialogViewStyles.box} ${styles.box}">
        <h1 class="${dialogViewStyles.header}">${I18n.t('pageflow_scrolled.editor.insert_content_element.header')}</h1>
        <ul class="${styles.categories}"></ul>

        <div class="${dialogViewStyles.footer}">
          <button class="${dialogViewStyles.close} ${styles.close}">
            ${I18n.t('pageflow_scrolled.editor.insert_content_element.cancel')}
          </button>
        </div>
      </div>
    </div>
  `,

  ui: cssModulesUtils.ui(styles, 'categories'),

  mixins: [dialogView],

  events: {
    'click li button': function() {
      this.close();
    }
  },

  onRender() {
    this.subview(new CollectionView({
      el: this.ui.categories,
      collection: new Backbone.Collection(
        this.options.editor.contentElementTypes.groupedByCategory()
      ),
      itemViewConstructor: CategoryView,
      itemViewOptions: {
        entry: this.options.entry,
        insertOptions: this.options.insertOptions
      }
    }));
  }
});

const CategoryView = Marionette.ItemView.extend({
  tagName: 'li',
  className: styles.category,

  template: ({displayName}) => `
    <h2 class="${styles.categoryName}">${displayName}</h2>
    <ul class="${styles.types}">
    </ul>
  `,

  ui: cssModulesUtils.ui(styles, 'types'),

  onRender() {
    this.subview(new CollectionView({
      el: this.ui.types,
      collection: new Backbone.Collection(
        this.model.get('contentElementTypes')
      ),
      itemViewConstructor: ItemView,
      itemViewOptions: {
        entry: this.options.entry,
        insertOptions: this.options.insertOptions
      }
    }));
  }
});

const ItemView = Marionette.ItemView.extend({
  tagName: 'li',
  className: styles.item,

  template: ({displayName, description, pictogram}) => `
    <button class="${styles.type}">
      <img class="${styles.typePictogram}" src="${pictogram || defaultPictogram}" width="20" height="20" />
      <span class="${styles.typeName}">${displayName}</span>
      <span class="${styles.typeDescription}">${description}</span>
    </button>
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
