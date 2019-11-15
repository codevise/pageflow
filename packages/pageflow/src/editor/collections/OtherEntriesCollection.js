import Backbone from 'backbone';
import _ from 'underscore';

import {OtherEntry} from '../models/OtherEntry';

import {state} from '$state';

export const OtherEntriesCollection = Backbone.Collection.extend({
  model: OtherEntry,
  url: '/editor/entries',

  initialize: function(models, options) {
    options = options || {};
    this.excludeEntry = options.excludeEntry;
  },

  // override parse method to exclude the entry being edited. This is the collection
  // of the "other" entries, after all.
  parse: function(response) {
    var excludeEntry = this.getExcludeEntry(),
        filteredResponse = _.filter(response, function(entry){ return entry.id != excludeEntry.id; });

    return Backbone.Collection.prototype.parse.call(this, filteredResponse);
  },

  getExcludeEntry: function() {
    return this.excludeEntry || state.entry;
  }
});
