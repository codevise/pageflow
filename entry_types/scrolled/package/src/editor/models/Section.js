import Backbone from 'backbone';

import {
  configurationContainer,
  entryTypeEditorControllerUrls,
  failureTracking,
  delayedDestroying,
  ForeignKeySubsetCollection
} from 'pageflow/editor';

import {SectionConfiguration} from './SectionConfiguration';

export const Section = Backbone.Model.extend({
  mixins: [
    configurationContainer({
      autoSave: true,
      includeAttributesInJSON: ['position'],
      configurationModel: SectionConfiguration
    }),
    delayedDestroying,
    entryTypeEditorControllerUrls.forModel({resources: 'sections'}),
    failureTracking
  ],

  initialize(attributes, options) {
    this.contentElements = new ForeignKeySubsetCollection({
      parent: options.contentElements,
      parentModel: this,
      foreignKeyAttribute: 'sectionId',
      parentReferenceAttribute: 'section',
      autoConsolidatePositions: false
    });
  },

  chapterPosition: function() {
    return this.chapter && this.chapter.has('position') ? this.chapter.get('position') : -1;
  },
});
