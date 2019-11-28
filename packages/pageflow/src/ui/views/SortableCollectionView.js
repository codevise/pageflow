import $ from 'jquery';
import _ from 'underscore';

import {CollectionView} from './CollectionView';

export const SortableCollectionView = CollectionView.extend({
  render: function() {
    CollectionView.prototype.render.call(this);

    this.$el.sortable({
      connectWith: this.options.connectWith,
      placeholder: 'sortable-placeholder',
      forcePlaceholderSize: true,
      delay: 200,

      update: _.bind(function(event, ui) {
        if (ui.item.parent().is(this.el)) {
          this.updateOrder();
        }
      }, this),

      receive: _.bind(function(event, ui) {
        var view = ui.item.data('view');

        this.reindexPositions();

        this.itemViews.add(view);
        this.collection.add(view.model);
      }, this),

      remove: _.bind(function(event, ui) {
        var view = ui.item.data('view');

        this.itemViews.remove(view);
        this.collection.remove(view.model);
      }, this)
    });

    return this;
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