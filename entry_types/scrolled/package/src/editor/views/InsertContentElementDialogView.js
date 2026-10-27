import I18n from 'i18n-js';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';

import {app, CollectionView} from 'pageflow/editor';
import {features} from 'pageflow/frontend';
import {TabsView, cssModulesUtils} from 'pageflow/ui';

import {FragmentLibrariesCollection} from '../collections/FragmentLibrariesCollection';

import {FragmentThumbnailView} from './FragmentThumbnailView';
import {dialogView} from './mixins/dialogView';
import dialogViewStyles from './mixins/dialogView.module.css';
import styles from './InsertContentElementDialogView.module.css';

import defaultPictogram from './images/defaultPictogram.svg';

const t = key => I18n.t(`pageflow_scrolled.editor.insert_content_element.${key}`);

export const InsertContentElementDialogView = Marionette.ItemView.extend({
  template: () => `
    <div class="${dialogViewStyles.backdrop}">
      <div class="editor ${dialogViewStyles.box} ${styles.box}">
        <h1 class="${dialogViewStyles.header}">${t('header')}</h1>
        <div class="${styles.body}"></div>

        <div class="${dialogViewStyles.footer}">
          <button class="${dialogViewStyles.close} ${styles.close}">
            ${t('cancel')}
          </button>
        </div>
      </div>
    </div>
  `,

  ui: cssModulesUtils.ui(styles, 'box', 'body'),

  mixins: [dialogView],

  events: {
    'click li button': function() {
      this.close();
    }
  },

  onRender() {
    if (features.isEnabled('fragments')) {
      this.ui.box.addClass(styles.withTabs);
      this.renderTabs();
    }
    else {
      this.appendSubview(this.createCategoriesView(), {to: this.ui.body});
    }
  },

  renderTabs() {
    const tabsView = new TabsView({
      translationKeyPrefixes: ['pageflow_scrolled.editor.insert_content_element.tabs'],
      defaultTab: 'contentElementTypes'
    });

    tabsView.tab('contentElementTypes', () => this.createCategoriesView());
    tabsView.tab('fragments', () => new FragmentsView({
      entry: this.options.entry,
      insertOptions: this.options.insertOptions,
      fragments: this.fragments()
    }));

    this.appendSubview(tabsView, {to: this.ui.body});
  },

  createCategoriesView() {
    return new CollectionView({
      tagName: 'ul',
      className: styles.categories,
      collection: new Backbone.Collection(
        this.options.editor.contentElementTypes.groupedByCategory()
      ),
      itemViewConstructor: CategoryView,
      itemViewOptions: {
        entry: this.options.entry,
        insertOptions: this.options.insertOptions
      }
    });
  },

  fragments() {
    if (!this.fragmentsPromise) {
      const libraries = new FragmentLibrariesCollection();

      this.fragmentsPromise = libraries.fetch().then(
        () => libraries.sharedFragments({kind: 'contentElements'})
      );
      this.fragmentsPromise.fail(() => {
        this.fragmentsPromise = null;
      });
    }

    return this.fragmentsPromise;
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

  template: ({displayName, description, pictogram, disabled}) => `
    <button class="${styles.type}"${disabled ? ' disabled' : ''}>
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
  },

  serializeData() {
    return {
      ...this.model.attributes,
      disabled: this.options.insertOptions.at === 'backdropOfSection' &&
                !this.model.get('supportedPositions').includes('backdrop')
    };
  }
});

const FragmentsView = Marionette.ItemView.extend({
  className: styles.fragmentsPane,

  template: () => `
    <h2 class="${styles.categoryName}">${t('fragments_heading')}</h2>
    <ul class="${styles.fragments}"></ul>
  `,

  ui: cssModulesUtils.ui(styles, 'fragments'),

  onRender() {
    this.options.fragments.then(fragments => {
      if (this.isClosed) {
        return;
      }

      this.subview(new CollectionView({
        el: this.ui.fragments,
        collection: fragments,
        itemViewConstructor: FragmentCardView,
        itemViewOptions: {
          entry: this.options.entry,
          insertOptions: this.options.insertOptions
        },
        blankSlateViewConstructor: FragmentsBlankSlateView
      }));
    }, () => {
      if (!this.isClosed) {
        this.ui.fragments.append(
          `<li class="${styles.fragmentsBlankSlate}" role="alert">${t('fragments_load_failed')}</li>`
        );
      }
    });
  }
});

const FragmentsBlankSlateView = Marionette.ItemView.extend({
  tagName: 'li',
  className: styles.fragmentsBlankSlate,
  template: () => t('fragments_blank_slate')
});

const FragmentCardView = Marionette.ItemView.extend({
  tagName: 'li',
  className: styles.fragment,

  template: () => `
    <button class="${styles.fragmentButton}">
      <span class="${styles.fragmentThumbnail}"></span>
      <span class="${styles.fragmentTitle}"></span>
      <span class="${styles.fragmentTypes}"></span>
    </button>
  `,

  ui: cssModulesUtils.ui(styles,
                         'fragmentButton', 'fragmentThumbnail', 'fragmentTitle', 'fragmentTypes'),

  events: cssModulesUtils.events(styles, {
    'click fragmentButton': function() {
      this.options.entry
        .insertContentElementFragment(this.model, this.options.insertOptions)
        .catch(() => app.trigger('error', {message: t('insert_fragment_failed')}));
    }
  }),

  onRender() {
    this.ui.fragmentButton.prop('disabled',
                                this.options.insertOptions.at === 'backdropOfSection');

    this.ui.fragmentTitle.text(this.model.get('title') || t('unnamed_fragment'));
    this.ui.fragmentTypes.text(contentElementTypeNames(this.model));

    this.appendSubview(new FragmentThumbnailView({
      model: this.model,
      entry: this.options.entry
    }), {to: this.ui.fragmentThumbnail});
  }
});

function contentElementTypeNames(fragment) {
  const typeNames = fragment.get('collections').contentElements.map(
    contentElement => contentElement.typeName
  );

  return [...new Set(typeNames)]
    .map(typeName => I18n.t(`pageflow_scrolled.editor.content_elements.${typeName}.name`))
    .join(', ');
}

InsertContentElementDialogView.show = function(options) {
  const view = new InsertContentElementDialogView(options);
  app.dialogRegion.show(view.render());
};
