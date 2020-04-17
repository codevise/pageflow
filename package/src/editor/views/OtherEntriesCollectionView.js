import Marionette from 'backbone.marionette';

import {CollectionView} from 'pageflow/ui';

import {OtherEntriesCollection} from '../collections/OtherEntriesCollection';

import {LoadingView} from './LoadingView';
import {OtherEntryItemView} from './OtherEntryItemView';

import template from '../templates/otherEntriesBlankSlate.jst';

export const OtherEntriesCollectionView = Marionette.View.extend({
  initialize: function() {
    this.otherEntries = new OtherEntriesCollection();

    this.listenTo(this.otherEntries, 'sync', function() {
      if (this.otherEntries.length === 1) {
        this.options.selection.set('entry', this.otherEntries.first());
      }
    });
  },

  render: function() {
    this.subview(new CollectionView({
      el: this.el,
      collection: this.otherEntries,
      itemViewConstructor: OtherEntryItemView,
      itemViewOptions: {
        selection: this.options.selection
      },
      blankSlateViewConstructor: Marionette.ItemView.extend({
        template,
        tagName: 'li',
        className: 'blank_slate'
      }),
      loadingViewConstructor: LoadingView
    }));

    this.otherEntries.fetch();

    return this;
  }
});
