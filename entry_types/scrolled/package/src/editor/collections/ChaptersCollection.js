import Backbone from 'backbone';

import {Chapter} from '../models/Chapter';

export const ChaptersCollection = Backbone.Collection.extend({
  model: Chapter
});
