import Backbone from 'backbone';
import I18n from 'i18n-js';

import {
  configurationContainer,
  entryTypeEditorControllerUrls,
  failureTracking,
  delayedDestroying,
  ForeignKeySubsetCollection
} from 'pageflow/editor';

import {Section} from './Section';

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
      parentReferenceAttribute: 'chapter',
      autoConsolidatePositions: false
    });
    this.entry = options.entry;
  },

  getDisplayTitle() {
    return this.configuration.get('title') ||
           I18n.t('pageflow_scrolled.editor.chapter_item.unnamed')
  },

  getDisplayNumber() {
    if (this.storyline.isMain()) {
      return I18n.t('pageflow_scrolled.editor.chapter_item.chapter') + ' ' + (this.get('position') + 1);
    }
  },

  addSection(attributes, options) {
    const section = this.sections.create(
      new Section(
        {
          position: this.sections.length ? Math.max(...this.sections.pluck('position')) + 1 : 0,
          chapterId: this.id,
          configuration: {
            transition: this.entry.metadata.configuration.get('defaultTransition')
          },
          ...attributes
        },
        {
          contentElements: this.entry.contentElements
        }
      ),
      options
    );

    section.once('sync', (model, response) => {
      this.entry.trigger('selectSection', section);
      this.entry.trigger('scrollToSection', section);

      section.configuration.set(response.configuration, {autoSave: false});
      section.contentElements.add(response.contentElements);
    });

    return section;
  },

  insertSection({before, after}, options) {
    const position = before ? before.get('position') : after.get('position') + 1;

    this.sections.each((section) => {
      if (section.get('position') >= position) {
        section.set('position', section.get('position') + 1);
      }
    });

    const newSection = this.addSection({position}, options);

    this.sections.sort();
    return newSection;
  },

  duplicateSection(section) {
    const newSection = this.insertSection({after: section}, {
      url: `${section.url()}/duplicate`,
    });

    return newSection;
  }
});
