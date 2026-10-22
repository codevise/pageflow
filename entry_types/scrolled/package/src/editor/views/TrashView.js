import I18n from 'i18n-js';
import Marionette from 'backbone.marionette';
import React from 'react';
import ReactDOM from 'react-dom';

import {editor, CollectionView, LoadingView} from 'pageflow/editor';
import {cssModulesUtils} from 'pageflow/ui';
import {StandaloneSectionThumbnail} from 'pageflow-scrolled/frontend';
import {watchFileCollections} from 'pageflow-scrolled/entryState';

import styles from './TrashView.module.css';

const t = (key, options) => I18n.t(`pageflow_scrolled.editor.trash_view.${key}`, options);

export const TrashView = Marionette.ItemView.extend({
  template: () => `
    <a class="back" href="">${t('back')}</a>
    <p class="${styles.hint}">${t('hint')}</p>
    <ul class="${styles.items}"></ul>
  `,

  ui: cssModulesUtils.ui(styles, 'items'),

  events: {
    'click a.back': function() {
      editor.navigate('/', {trigger: true});
      return false;
    }
  },

  onRender() {
    const {entry} = this.options;
    const loadingView = this.subview(new LoadingView());

    this.ui.items.append(loadingView.render().el);

    entry.trashItems.fetch({reset: true}).then(() => {
      if (this.isClosed) {
        return;
      }

      loadingView.close();

      this.subview(new CollectionView({
        el: this.ui.items,
        collection: entry.trashItems,
        itemViewConstructor: TrashItemView,
        itemViewOptions: {entry},
        blankSlateViewConstructor: BlankSlateView
      }));
    }, () => {
      if (this.isClosed) {
        return;
      }

      loadingView.close();
      this.ui.items.append(`<li class="${styles.loadFailed}" role="alert">${t('load_failed')}</li>`);
    });
  }
});

const BlankSlateView = Marionette.ItemView.extend({
  tagName: 'li',
  className: styles.blankSlate,
  template: () => t('blank_slate')
});

const TrashItemView = Marionette.ItemView.extend({
  tagName: 'li',
  className: styles.item,

  template: () => `
    <div class="${styles.thumbnail}"></div>
    <div class="${styles.details}">
      <span class="${styles.origin}"></span>
      <time class="${styles.trashedAt}"></time>
      <span class="${styles.error}" role="alert"></span>
    </div>
    <button class="${styles.restore}">
      <svg class="${styles.restoreIcon}"
           xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16"
           fill="none" stroke="currentColor" stroke-width="2"
           stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M3 7v6h6" />
        <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
      </svg>
      ${t('restore')}
    </button>
  `,

  ui: cssModulesUtils.ui(styles, 'thumbnail', 'origin', 'trashedAt', 'error', 'restore'),

  events: cssModulesUtils.events(styles, {
    'click restore': function() {
      this.ui.restore.prop('disabled', true);
      this.ui.error.text('');

      this.model.restore().catch(() => {
        this.ui.restore.prop('disabled', false);
        this.ui.error.text(t(this.model.get('kind') === 'chapter' ?
                             'restore_chapter_failed' :
                             'restore_failed'));
      });
    }
  }),

  onRender() {
    this.ui.origin.text(this.originLabel());
    this.ui.trashedAt
      .attr('datetime', this.model.get('trashedAt'))
      .text(t('trashed_at', {
        time: new Date(this.model.get('trashedAt')).toLocaleString(I18n.locale, {
          dateStyle: 'medium',
          timeStyle: 'short'
        })
      }));

    ReactDOM.render(
      React.createElement(StandaloneSectionThumbnail, {
        sectionPermaId: this.model.firstSectionPermaId(),
        seed: this.model.seed(this.options.entry.scrolledSeed),
        subscribe: dispatch => watchFileCollections(this.options.entry, {dispatch})
      }),
      this.ui.thumbnail[0]
    );
  },

  onClose() {
    ReactDOM.unmountComponentAtNode(this.ui.thumbnail[0]);
  },

  originLabel() {
    if (this.model.get('kind') === 'chapter') {
      return t('chapter', {
        title: this.model.get('title') ||
               I18n.t('pageflow_scrolled.editor.chapter_item.unnamed'),
        count: this.model.get('sections').length
      });
    }

    const chapter = this.options.entry.chapters.findWhere({
      permaId: this.model.get('originPermaId')
    });

    return chapter ?
           t('origin', {chapter: chapter.getDisplayName()}) :
           t('origin_missing');
  }
});
