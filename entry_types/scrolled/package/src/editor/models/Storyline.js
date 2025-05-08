import Backbone from 'backbone';

import {
  configurationContainer,
  ForeignKeySubsetCollection
} from 'pageflow/editor';

export const Storyline = Backbone.Model.extend({
  mixins: [
    configurationContainer({
      includeAttributesInJSON: ['position']
    })
  ],

  initialize(attributes, options) {
    this.chapters = new ForeignKeySubsetCollection({
      parent: options.chapters,
      parentModel: this,
      foreignKeyAttribute: 'storylineId',
      parentReferenceAttribute: 'storyline',
      autoConsolidatePositions: false
    });
    this.entry = options.entry;
  },

  addChapter(attributes) {
    return this.chapters.create({
      position: this.chapters.length ? Math.max(...this.chapters.pluck('position')) + 1 : 0,
      storylineId: this.id,
      ...attributes
    }, {
      entry: this.entry,
      sections: this.entry.sections
    });
  },

  isMain() {
    return !!this.configuration.get('main');
  }
});
