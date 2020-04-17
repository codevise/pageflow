import Backbone from 'backbone';

import {Chapter} from '../models/Chapter';

export const ChaptersCollection = Backbone.Collection.extend({
  model: Chapter,

  url:  '/chapters',

  comparator: function(chapter) {
    return chapter.get('position');
  }
});
