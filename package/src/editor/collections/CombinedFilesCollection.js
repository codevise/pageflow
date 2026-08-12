import Backbone from 'backbone';
import _ from 'underscore';

import {byFileName} from './FilesCollection';
import {cidBasedGet} from './cidBasedGet';

export const CombinedFilesCollection = Backbone.Collection.extend({
  constructor: function(options) {
    this.collections = options.collections;

    Backbone.Collection.prototype.constructor.call(
      this,
      _.flatten(_.pluck(this.collections, 'models'), true)
    );

    _.each(this.collections, function(collection) {
      this.listenTo(collection, 'add', function(file) {
        this.add(file);
      });

      this.listenTo(collection, 'remove', function(file) {
        this.remove(file);
      });
    }, this);
  },

  comparator: byFileName,

  get: function(file) {
    if (file != null && !file.cid) {
      throw new Error(
        'Cannot look up files by id in combined files collections since files ' +
        'of different types can share ids. Pass a file instead.'
      );
    }

    return cidBasedGet.call(this, file);
  },

  dispose: function() {
    this.stopListening();
    this.reset();
  }
});
