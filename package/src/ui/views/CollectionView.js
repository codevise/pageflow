import ChildViewContainer from 'backbone.babysitter';
import Marionette from 'backbone.marionette';
import _ from 'underscore';

export const CollectionView = Marionette.View.extend({
  initialize: function() {
    this.rendered = false;
    this.itemViews = new ChildViewContainer();

    this.collection.map(this.addItem, this);

    this.listenTo(this.collection, 'add', this.addItem);
    this.listenTo(this.collection, 'remove', this.removeItem);
    this.listenTo(this.collection, 'sort', this.sort);

    if (this.options.loadingViewConstructor) {
      this.listenTo(this.collection, 'request', function() {
        this.loading = true;
        this.togglePlaceHolder();
      });
      this.listenTo(this.collection, 'sync', function() {
        this.loading = false;
        this.togglePlaceHolder();
      });
    }
  },

  render: function() {
    if (!this.rendered) {
      this.$el.append(this.itemViews.map(function(itemView) {
        itemView.$el.data('view', itemView);
        return itemView.render().el;
      }));

      this.togglePlaceHolder();
      this.rendered = true;
    }

    return this;
  },

  onClose: function() {
    this.itemViews.call('close');

    this.closePlaceHolderView();
  },

  addItem: function(item) {
    var view = new this.options.itemViewConstructor(_.extend({
      model: item
    }, this.getItemViewOptions(item)));

    this.itemViews.add(view);

    if (this.rendered) {
      var index = this.collection.indexOf(item);

      view.render();
      view.$el.data('view', view);

      if (index > 0) {
        this.$el.children().eq(index - 1).after(view.el);
      }
      else {
        this.$el.prepend(view.el);
      }

      this.togglePlaceHolder();
    }
  },

  removeItem: function(item) {
    var view = this.itemViews.findByModel(item);

    if (view) {
      this.itemViews.remove(view);
      view.close();

      this.togglePlaceHolder();
    }
  },

  sort: function() {
    var last = null;

    this.collection.each(function(item) {
      var itemView = this.itemViews.findByModel(item);
      var element;

      if (!itemView) {
        return;
      }

      element = itemView.$el;

      if (last) {
        last.after(element);
      }
      else {
        this.$el.prepend(element);
      }

      last = element;
    }, this);
  },

  getItemViewOptions: function(item) {
    if (typeof this.options.itemViewOptions === 'function') {
      return this.options.itemViewOptions(item);
    }
    else {
      return this.options.itemViewOptions || {};
    }
  },

  closePlaceHolderView: function() {
    if (this.placeHolderView) {
      this.placeHolderView.close();
      this.placeHolderView = null;
    }
  },

  togglePlaceHolder: function() {
    var lastPlaceholderConstructor = this.placeHolderConstructor;
    this.placeHolderConstructor = this.getPlaceHolderConstructor();

    if (this.itemViews.length || !this.placeHolderConstructor) {
      this.closePlaceHolderView();
    }
    else if(!this.placeHolderView || lastPlaceholderConstructor !== this.placeHolderConstructor) {
      this.closePlaceHolderView();

      this.placeHolderView = new this.placeHolderConstructor();
      this.$el.append(this.placeHolderView.render().el);
    }
  },

  getPlaceHolderConstructor: function() {
    if(this.loading && this.options.loadingViewConstructor) {
      return this.options.loadingViewConstructor;
    }
    else if (this.options.blankSlateViewConstructor) {
      return this.options.blankSlateViewConstructor;
    }
  }
});
