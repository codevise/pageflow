import Backbone from 'backbone';
import _ from 'underscore';

import {cidBasedGet} from './cidBasedGet';

// Each collection keeps its own order, so that its models stay together
// as one section of the list.
export const ConcatenatedCollection = Backbone.Collection.extend({
  get: cidBasedGet,

  constructor: function(options) {
    this.collections = options.collections;

    Backbone.Collection.prototype.constructor.call(this, this.allModels());

    _.each(this.collections, function(collection) {
      this.listenTo(collection, 'add', function(model) {
        this.add(model);
      });

      this.listenTo(collection, 'remove', function(model) {
        this.remove(model);
      });

      this.listenTo(collection, 'sort', function() {
        this.sort();
      });
    }, this);
  },

  comparator: function(model) {
    return this.positions[model.cid];
  },

  // Looking up the position of each model while comparing would turn
  // every insert into a quadratic sort. Backbone sorts whenever models
  // are added, which keeps the positions up to date.
  sort: function(options) {
    this.positions = {};

    this.allModels().forEach(function(model, index) {
      this.positions[model.cid] = index;
    }, this);

    return Backbone.Collection.prototype.sort.call(this, options);
  },

  allModels: function() {
    return _.flatten(_.pluck(this.collections, 'models'), true);
  },

  dispose: function() {
    this.stopListening();
    this.reset();
  }
});
