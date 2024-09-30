import $ from 'jquery';
import _ from 'underscore';
import Sortable from 'sortablejs';

import {CollectionView} from './CollectionView';

export const SortableCollectionView = CollectionView.extend({
  render: function() {
    CollectionView.prototype.render.call(this);

    this.sortable = Sortable.create(this.el, {
      group: this.options.connectWith,
      animation: 150,

      ghostClass: 'sortable-placeholder',

      onEnd: event => {
        const item = $(event.item);

        if (item.parent().is(this.el)) {
          this.updateOrder();
        }
      },

      onRemove: event => {
        const view = $(event.item).data('view');

        this.itemViews.remove(view);
        this.collection.remove(view.model);
      },

      onSort: event => {
        if (event.from !== event.to && event.to === this.el) {
          const view = $(event.item).data('view');

          this.reindexPositions();

          this.itemViews.add(view);
          this.collection.add(view.model);

          this.collection.saveOrder();
        }
      }
    });

    return this;
  },

  disableSorting() {
    this.sortable.option('disabled', true);
  },

  enableSorting() {
    this.sortable.option('disabled', false);
  },

  addItem: function(item) {
    if (!this.itemViews.findByModel(item)) {
      CollectionView.prototype.addItem.call(this, item);
    }
  },

  removeItem: function(item) {
    if (this.itemViews.findByModel(item)) {
      CollectionView.prototype.removeItem.call(this, item);
    }
  },

  updateOrder: function() {
    this.reindexPositions();

    this.collection.sort();
    this.collection.saveOrder();
  },

  reindexPositions: function() {
    this.$el.children().each(function(index) {
      $(this).data('view').model.set('position', index);
    });
  }
});
