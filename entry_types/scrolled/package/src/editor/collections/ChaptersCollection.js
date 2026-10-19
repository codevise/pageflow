import Backbone from 'backbone';
import {entryTypeEditorControllerUrls} from 'pageflow/editor';

import {Chapter} from '../models/Chapter';

export const ChaptersCollection = Backbone.Collection.extend({
  model: Chapter,

  mixins: [
    entryTypeEditorControllerUrls.forCollection({resources: 'chapters'})
  ],

  comparator: function(chapterA, chapterB) {
    return storylinePosition(chapterA) - storylinePosition(chapterB) ||
           chapterA.get('position') - chapterB.get('position');
  }
});

function storylinePosition(chapter) {
  return chapter.storyline?.get('position') || 0;
}
