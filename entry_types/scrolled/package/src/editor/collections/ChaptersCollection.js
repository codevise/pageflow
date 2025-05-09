import Backbone from 'backbone';
import {entryTypeEditorControllerUrls} from 'pageflow/editor';

import {Chapter} from '../models/Chapter';

export const ChaptersCollection = Backbone.Collection.extend({
  model: Chapter,

  mixins: [
    entryTypeEditorControllerUrls.forCollection({resources: 'chapters'})
  ],

  comparator: function(chapter) {
    return chapter.get('position');
  }
});
