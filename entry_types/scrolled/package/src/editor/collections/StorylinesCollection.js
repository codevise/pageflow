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
    return this.find(storyline => storyline.isMain());
  },

  excursions() {
    return this.find(storyline => !storyline.isMain());
  }
});
