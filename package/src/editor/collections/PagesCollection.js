import Backbone from 'backbone';
import _ from 'underscore';

import {Page} from '../models/Page';
import {SubsetCollection} from './SubsetCollection';

export const PagesCollection = Backbone.Collection.extend({
  model: Page,

  url: '/pages',

  comparator: function(pageA, pageB) {
    if (pageA.storylinePosition() > pageB.storylinePosition()) {
      return 1;
    }
    else if (pageA.storylinePosition() < pageB.storylinePosition()) {
      return -1;
    }
    else if (pageA.chapterPosition() > pageB.chapterPosition()) {
      return 1;
    }
    else if (pageA.chapterPosition() < pageB.chapterPosition()) {
      return -1;
    }
    else if (pageA.get('position') > pageB.get('position')) {
      return 1;
    }
    else if (pageA.get('position') < pageB.get('position')) {
      return -1;
    }
    else {
      return 0;
    }
  },

  getByPermaId: function(permaId) {
    return this.findWhere({perma_id: parseInt(permaId, 10)});
  },

  persisted: function() {
    if (!this._persisted) {
      this._persisted = new SubsetCollection({
        parent: this,
        sortOnParentSort: true,

        filter: function(page) {
          return !page.isNew();
        },
      });

      this.listenTo(this, 'change:id', function(model) {
        setTimeout(_.bind(function() {
          this._persisted.add(model);
        }, this), 0);
      });
    }

    return this._persisted;
  },
});
