import Backbone from 'backbone';

import {
  configurationContainer,
  entryTypeEditorControllerUrls,
  failureTracking,
  delayedDestroying,
  ForeignKeySubsetCollection
} from 'pageflow/editor';

export const Chapter = Backbone.Model.extend({
  mixins: [
    configurationContainer({
      autoSave: true,
      includeAttributesInJSON: ['position']
    }),
    delayedDestroying,
    entryTypeEditorControllerUrls.forModel({resources: 'chapters'}),
    failureTracking
  ],

  initialize(attributes, options) {
    this.sections = new ForeignKeySubsetCollection({
      parent: options.sections,
      parentModel: this,
      foreignKeyAttribute: 'chapterId',
      parentReferenceAttribute: 'chapter'
    });
    this.entry = options.entry;
  },

  addSection(attributes) {
    const section = this.sections.create({
      position: this.sections.length,
      chapterId: this.id,
      ...attributes
    }, {
      contentElements: this.entry.contentElements
    });

    section.once('sync', () => {
      this.entry.trigger('selectSectionSettings', section);
      this.entry.trigger('scrollToSection', section);

      section.contentElements.create({
        typeName: 'textBlock',
        configuration: {
        }
      });
    });
  }
});
