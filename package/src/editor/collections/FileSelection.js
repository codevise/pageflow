import Backbone from 'backbone';

import {cidBasedGet} from './cidBasedGet';

export const FileSelection = Backbone.Collection.extend({
  get: cidBasedGet,

  // Checking files stays switched on until it is switched off again,
  // even while nothing is checked. Unchecking the last file would
  // otherwise pull the check boxes away from under the pointer.
  start: function() {
    this.selecting = true;
    this.trigger('change:selecting');
  },

  stop: function() {
    this.selecting = false;
    this.reset();
    this.trigger('change:selecting');
  },

  isSelecting: function() {
    return !!this.selecting;
  },

  toggle: function(file) {
    if (this.includes(file)) {
      this.remove(file);
    }
    else {
      this.add(file);
    }
  },

  includes: function(file) {
    return !!this.get(file);
  }
});
