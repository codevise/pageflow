import Marionette from 'backbone.marionette';
import _ from 'underscore';

import {CollectionView, SortableCollectionView} from 'pageflow/ui';

import {ChapterItemView} from './ChapterItemView';
import {NavigatableChapterItemView} from './NavigatableChapterItemView';
import {NavigatablePageItemView} from './NavigatablePageItemView';
import {PageItemView} from './PageItemView';

import template from '../templates/storylineOutline.jst';

export const StorylineOutlineView = Marionette.Layout.extend({
  template,
  className: 'storyline_outline',

  ui: {
    chapters: 'ul.storyline_outline_chapters'
  },

  events: {
    'click a.add_chapter': function() {
      this.model.scaffoldChapter();
    }
  },

  onRender: function() {
    this.ui.chapters.toggleClass('outline navigatable', !!this.options.navigatable);

    var collectionView = this.options.sortable ? SortableCollectionView : CollectionView;

    new collectionView({
      el: this.ui.chapters,
      collection: this.model.chapters,
      itemViewConstructor: this.options.navigatable ? NavigatableChapterItemView : ChapterItemView,
      itemViewOptions: {
        sortable: this.options.sortable,
        pageItemView: this.options.navigatable ? NavigatablePageItemView : PageItemView,
        pageItemViewOptions: _.extend({
          displayInNavigationHint: this.options.displayInNavigationHint
        }, this.options.pageItemViewOptions || {})
      }
    }).render();
  }
});
