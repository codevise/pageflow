import Backbone from 'backbone';

import {cidBasedGet} from './cidBasedGet';

export const ListSelection = Backbone.Collection.extend({
  get: cidBasedGet,

  // Checking items stays switched on until it is switched off again,
  // even while nothing is checked. Unchecking the last item would
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

  toggle: function(item) {
    if (this.includes(item)) {
      this.remove(item);
    }
    else {
      this.add(item);
    }
  },

  includes: function(item) {
    return !!this.get(item);
  }
});
