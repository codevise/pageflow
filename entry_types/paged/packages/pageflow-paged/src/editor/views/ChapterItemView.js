import I18n from 'i18n-js';
import Marionette from 'backbone.marionette';

import {CollectionView, SortableCollectionView} from 'pageflow/ui';

import {NavigatablePageItemView} from './NavigatablePageItemView';

import template from '../templates/chapterItem.jst';

export const ChapterItemView = Marionette.ItemView.extend({
  tagName: 'li',
  template,

  ui: {
    title: '> a > .title',
    number: '> a > .number',
    pages: 'ul.pages'
  },

  modelEvents: {
    change: 'update'
  },

  onRender: function() {
    var collectionView = this.options.sortable ? SortableCollectionView : CollectionView;

    this.subview(new collectionView({
      el: this.ui.pages,
      collection: this.model.pages,
      itemViewConstructor: this.options.pageItemView || NavigatablePageItemView,
      itemViewOptions: this.options.pageItemViewOptions,
      connectWith: 'ul.pages'
    }));

    this.update();
  },

  update: function() {
    this.ui.title.text(this.model.get('title') || I18n.t('pageflow.editor.views.chapter_item_view.unnamed'));
    this.ui.number.text(I18n.t('pageflow.editor.views.chapter_item_view.chapter') + ' ' + (this.model.get('position') + 1));
  }
});
