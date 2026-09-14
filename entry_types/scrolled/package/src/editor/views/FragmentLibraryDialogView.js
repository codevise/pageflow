import I18n from 'i18n-js';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import React from 'react';
import ReactDOM from 'react-dom';

import {app, CollectionView} from 'pageflow/editor';
import {cssModulesUtils} from 'pageflow/ui';
import {StandaloneSectionThumbnail} from 'pageflow-scrolled/frontend';

import {FragmentLibrariesCollection} from '../collections/FragmentLibrariesCollection';

import {dialogView} from './mixins/dialogView';
import dialogViewStyles from './mixins/dialogView.module.css';
import styles from './FragmentLibraryDialogView.module.css';

const t = key => I18n.t(`pageflow_scrolled.editor.fragment_library.${key}`);

export const FragmentLibraryDialogView = Marionette.ItemView.extend({
  template: () => `
    <div class="${dialogViewStyles.backdrop}">
      <div class="editor ${dialogViewStyles.box} ${styles.box}">
        <h1 class="${dialogViewStyles.header}">${t('header')}</h1>

        <div class="${styles.body}">
          <ul class="${styles.rail}">
            <li class="${styles.railItem} ${styles.activeRailItem}">
              <span class="${styles.railItemLabel}">${t('shared')}</span>
              <span class="${styles.railItemHint}">${t('shared_hint')}</span>
            </li>
          </ul>

          <ul class="${styles.cards}"></ul>
        </div>

        <div class="${dialogViewStyles.footer}">
          <button class="${dialogViewStyles.close}">${t('cancel')}</button>
        </div>
      </div>
    </div>
  `,

  ui: cssModulesUtils.ui(styles, 'cards'),

  mixins: [dialogView],

  initialize() {
    this.libraries = new FragmentLibrariesCollection();
    this.selection = new Backbone.Model();
  },

  onShow() {
    this.libraries.fetch().then(() => this.renderPanels());
  },

  renderPanels() {
    if (this.isClosed) {
      return;
    }

    this.fragments = this.libraries.sharedFragments();

    this.subview(new CollectionView({
      el: this.ui.cards,
      collection: this.fragments,
      itemViewConstructor: CardView,
      itemViewOptions: {
        entry: this.options.entry,
        selection: this.selection
      },
      blankSlateViewConstructor: BlankSlateView
    }));
  }
});

const BlankSlateView = Marionette.ItemView.extend({
  tagName: 'li',
  className: styles.blankSlate,
  template: () => t('blank_slate')
});

const CardView = Marionette.ItemView.extend({
  tagName: 'li',
  className: styles.card,

  template: () => `
    <button class="${styles.cardButton}">
      <span class="${styles.thumbnail}"></span>
      <span class="${styles.cardTitle}"></span>
    </button>
  `,

  ui: cssModulesUtils.ui(styles, 'cardButton', 'thumbnail', 'cardTitle'),

  events: cssModulesUtils.events(styles, {
    'click cardButton': function() {
      this.options.selection.set('fragment', this.model);
    }
  }),

  onRender() {
    this.listenTo(this.options.selection, 'change:fragment', this.updateSelected);
    this.updateSelected();

    this.ui.cardTitle.text(this.model.get('title') || t('unnamed'));
    this.renderThumbnail();
  },

  onClose() {
    ReactDOM.unmountComponentAtNode(this.ui.thumbnail[0]);
  },

  renderThumbnail() {
    ReactDOM.render(
      React.createElement(StandaloneSectionThumbnail, {
        sectionPermaId: this.model.firstSectionPermaId(),
        seed: this.model.seed(this.options.entry.scrolledSeed)
      }),
      this.ui.thumbnail[0]
    );
  },

  updateSelected() {
    this.ui.cardButton.toggleClass(styles.selectedCard,
                                   this.options.selection.get('fragment') === this.model);
  }
});

FragmentLibraryDialogView.show = function(options) {
  const view = new FragmentLibraryDialogView(options);
  app.dialogRegion.show(view.render());
  return view;
};
