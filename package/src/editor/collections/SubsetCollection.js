import Backbone from 'backbone';
import _ from 'underscore';

export const SubsetCollection = Backbone.Collection.extend({
  constructor: function(options) {
    var adding = false;
    var sorting = false;
    var parentSorting = false;

    options = options || {};

    this.predicate = options.filter || function(item) { return true; };
    this.parent = options.parent;
    this.parentModel = options.parentModel;

    delete options.filter;
    delete options.parent;

    this.model = this.parent.model;
    this.comparator = options.comparator || this.parent.comparator;

    this.listenTo(this.parent, 'add', function(model, collection, options) {
      if (!adding && this.predicate(model)) {
        this.add(model, options);
      }
    });

    this.listenTo(this.parent, 'remove', function(model) {
      this.remove(model);
    });

    this.listenTo(this, 'add', function(model, collection, options) {
      adding = true;
      this.parent.add(model);
      adding = false;
    });

    if (options.watchAttribute) {
      this.listenTo(this.parent, 'change:' + options.watchAttribute, function(model) {
        if (this.predicate(model)) {
          this.add(model);
        }
        else {
          this.remove(model);
        }
      });
    }

    if (options.sortOnParentSort) {
      this.listenTo(this.parent, 'sort', function() {
        parentSorting = true;

        if (!sorting) {
          this.sort();
        }

        parentSorting = false;
      });
    }

    this.listenTo(this, 'sort', function() {
      sorting = true;

      if (!parentSorting) {
        this.parent.sort();
      }

      sorting = false;
    });

    Backbone.Collection.prototype.constructor
      .call(this, this.parent.filter(this.predicate, this), options);
  },

  clear: function() {
    this.parent.remove(this.models);
    this.reset();
  },

  url: function() {
    return this.parentModel.url() + (_.result(this.parent, 'urlSuffix') ||
                                     _.result(this.parent, 'url'));
  },

  dispose: function() {
    this.stopListening();
    this.reset();
  },

  updateFilter: function(predicate) {
    this.predicate = predicate || function() { return true; };

    var modelsToRemove = [];
    var modelsToAdd = [];

    this.parent.each(function(model) {
      var included = !!this.get(model);
      var shouldBeIncluded = this.predicate(model);

      if (shouldBeIncluded && !included) {
        modelsToAdd.push(model);
      }
      if (!shouldBeIncluded && included) {
        modelsToRemove.push(model);
      }
    }, this);

    if (modelsToRemove.length) {
      this.remove(modelsToRemove);
    }
    if (modelsToAdd.length) {
      this.add(modelsToAdd);
    }

    return this;
  }
});
