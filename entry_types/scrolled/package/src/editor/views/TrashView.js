import I18n from 'i18n-js';
import Backbone from 'backbone';
import Marionette from 'backbone.marionette';
import React from 'react';
import ReactDOM from 'react-dom';

import {
  editor, CollectionView, DestroyMenuItem, DropDownButtonView, LoadingView
} from 'pageflow/editor';
import {cssModulesUtils} from 'pageflow/ui';
import {StandaloneSectionThumbnail} from 'pageflow-scrolled/frontend';
import {watchFileCollections} from 'pageflow-scrolled/entryState';

import styles from './TrashView.module.css';

const t = (key, options) => I18n.t(`pageflow_scrolled.editor.trash_view.${key}`, options);

export const TrashView = Marionette.ItemView.extend({
  template: () => `
    <div class="${styles.header}">
      <a class="back" href="">${t('back')}</a>
      <div class="${styles.actions}"></div>
    </div>
    <p class="${styles.actionError}" role="alert"></p>
    <p class="${styles.hint}">${t('hint')}</p>
    <ul class="${styles.items}"></ul>
  `,

  ui: cssModulesUtils.ui(styles, 'actions', 'actionError', 'items'),

  events: {
    'click a.back': function() {
      editor.navigate('/', {trigger: true});
      return false;
    }
  },

  onRender() {
    const {entry} = this.options;
    const loadingView = this.subview(new LoadingView());

    this.appendSubview(new DropDownButtonView({
      label: t('actions'),
      alignMenu: 'right',
      ellipsisIcon: true,
      openOnClick: true,
      items: new Backbone.Collection([
        new EmptyTrashMenuItem({}, {
          trashItems: entry.trashItems,
          onFailure: () => this.ui.actionError.text(t('empty_failed'))
        })
      ])
    }), {to: this.ui.actions});

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
    <div class="${styles.footer}">
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
      <div class="${styles.itemMenu}"></div>
    </div>
  `,

  ui: cssModulesUtils.ui(styles,
                         'thumbnail', 'origin', 'trashedAt', 'error', 'restore', 'itemMenu'),

  events: cssModulesUtils.events(styles, {
    'click restore': function() {
      this.ui.restore.prop('disabled', true);
      this.ui.error.text('');

      this.model.restore().catch(() => {
        this.ui.restore.prop('disabled', false);
        this.ui.error.text(t(restoreFailedKeys[this.model.get('kind')]));
      });
    }
  }),

  onRender() {
    this.appendSubview(new DropDownButtonView({
      title: t('actions'),
      alignMenu: 'right',
      ellipsisIcon: true,
      borderless: true,
      openOnClick: true,
      items: new Backbone.Collection([
        new DeleteTrashItemMenuItem({}, {
          trashItem: this.model,
          onFailure: () => this.ui.error.text(t('delete_failed'))
        })
      ])
    }), {to: this.ui.itemMenu});

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
    const {entry} = this.options;
    const originPermaId = this.model.get('originPermaId');

    if (this.model.get('kind') === 'chapter') {
      return t('chapter', {
        title: this.model.get('title') ||
               I18n.t('pageflow_scrolled.editor.chapter_item.unnamed'),
        count: this.model.get('sections').length
      });
    }
    else if (this.model.get('kind') === 'contentElements') {
      const types = contentElementTypeNames(this.model);
      const section = entry.sections.findWhere({permaId: originPermaId});

      return section ?
             t('content_elements', {types, section: sectionName(section)}) :
             t('content_elements_origin_missing', {types});
    }

    const chapter = entry.chapters.findWhere({permaId: originPermaId});

    return chapter ?
           t('origin', {chapter: chapter.getDisplayName()}) :
           t('origin_missing');
  }
});

const EmptyTrashMenuItem = DestroyMenuItem.extend({
  translationKeyPrefix: 'pageflow_scrolled.editor.trash_view.empty_trash',

  destroyModel() {
    this.options.trashItems.empty().catch(this.options.onFailure);
  }
});

const DeleteTrashItemMenuItem = DestroyMenuItem.extend({
  translationKeyPrefix: 'pageflow_scrolled.editor.trash_view.delete_item',

  destroyModel() {
    this.options.trashItem.permanentlyDelete().catch(this.options.onFailure);
  }
});

const restoreFailedKeys = {
  chapter: 'restore_chapter_failed',
  section: 'restore_failed',
  contentElements: 'restore_content_elements_failed'
};

function contentElementTypeNames(trashItem) {
  const typeNames = trashItem.get('sections').flatMap(section =>
    section.contentElements.map(contentElement => contentElement.typeName)
  );

  return [...new Set(typeNames)]
    .map(typeName => I18n.t(`pageflow_scrolled.editor.content_elements.${typeName}.name`))
    .join(', ');
}

function sectionName(section) {
  return I18n.t('pageflow_scrolled.editor.configuration_places.label', {
    chapter: section.chapter.getDisplayName(),
    subject: I18n.t('pageflow_scrolled.editor.configuration_places.section', {
      number: section.chapter.sections.indexOf(section) + 1
    })
  });
}
