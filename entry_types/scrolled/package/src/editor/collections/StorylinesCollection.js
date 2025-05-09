import Backbone from 'backbone';
import {entryTypeEditorControllerUrls, orderedCollection} from 'pageflow/editor';

import {Storyline} from '../models/Storyline';

export const StorylinesCollection = Backbone.Collection.extend({
  model: Storyline,

  mixins: [
    entryTypeEditorControllerUrls.forCollection({resources: 'storylines'}),
    orderedCollection
  ],

  comparator: function(chapter) {
    return chapter.get('position');
  },

  main() {
    return this.at(0);
  },

  excursions() {
    return this.at(1);
  }
});
