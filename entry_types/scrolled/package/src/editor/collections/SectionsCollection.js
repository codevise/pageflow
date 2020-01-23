import Backbone from 'backbone';
import {entryTypeEditorControllerUrls} from 'pageflow/editor';

import {Section} from '../models/Section';

export const SectionsCollection = Backbone.Collection.extend({
  model: Section,

  mixins: [
    entryTypeEditorControllerUrls.forCollection({resources: 'sections'})
  ],

  comparator: function(sectionA, sectionB) {
    if (sectionA.chapterPosition() > sectionB.chapterPosition()) {
      return 1;
    }
    else if (sectionA.chapterPosition() < sectionB.chapterPosition()) {
      return -1;
    }
    else if (sectionA.get('position') > sectionB.get('position')) {
      return 1;
    }
    else if (sectionA.get('position') < sectionB.get('position')) {
      return -1;
    }
    else {
      return 0;
    }
  }
});
