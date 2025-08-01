import Backbone from 'backbone';

import {SubsetCollection} from '../collections/SubsetCollection';

export const Search = Backbone.Model.extend({
  defaults: {
    term: '',
    order: 'alphabetical'
  },

  initialize: function(attrs, options = {}) {
    this.attribute = options.attribute;
    this.storageKey = options.storageKey;

    this.comparators = {
      alphabetical: function(file) {
        var fileName = file.get('display_name');
        return (fileName && fileName.toLowerCase) ? fileName.toLowerCase() : fileName;
      },

      most_recent: function(file) {
        var date = file.get('created_at');
        return date ? -new Date(date).getTime() : -file.id;
      }
    };

    this.orderAttributes = {
      alphabetical: 'display_name',
      most_recent: 'created_at'
    };

    if (this.storageKey) {
      const storage = this.getLocalStorage();

      if (storage && storage[this.storageKey]) {
        this.set('order', storage[this.storageKey]);
      }

      this.on('change:order', function() {
        const storage = this.getLocalStorage();

        if (storage) {
          storage[this.storageKey] = this.get('order');
        }
      });
    }
  },

  getLocalStorage: function() {
    try {
      return window.localStorage;
    }
    catch(e) {
      return null;
    }
  },

  matches: function(model) {
    var term = (this.get('term') || '').toLowerCase();
    var value = (model.get(this.attribute) || '').toLowerCase();
    return value.indexOf(term) >= 0;
  },

  applyTo: function(collection) {
    var subset = new SubsetCollection({
      parent: collection,
      parentModel: collection.parentModel,
      watchAttribute: this.attribute,
      filter: this.matches.bind(this),
      comparator: this.comparators[this.get('order')]
    });

    this.listenTo(this, 'change:term', function() {
      subset.updateFilter(this.matches.bind(this));
    });

    this.listenTo(this, 'change:order', function() {
      subset.comparator = this.comparators[this.get('order')];
      subset.sort();
    });

    this.listenTo(subset, 'change', function(model) {
      var attribute = this.orderAttributes[this.get('order')];
      if (model.hasChanged(attribute)) {
        subset.sort();
      }
    });

    return subset;
  }
});
