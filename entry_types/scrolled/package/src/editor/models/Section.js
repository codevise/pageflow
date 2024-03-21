import Backbone from 'backbone';
import {getAvailableTransitionNames} from 'pageflow-scrolled/frontend';

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

  getTransition() {
    const entry = this.chapter?.entry;

    if (!entry) {
      return 'scroll';
    }

    const sectionIndex = entry.sections.indexOf(this);
    const previousSection = entry.sections.at(sectionIndex - 1);

    const availableTransitions =
      previousSection ?
      getAvailableTransitionNames(
        this.configuration.attributes,
        previousSection.configuration.attributes
      ) : [];

    const transition = this.configuration.get('transition');

    if (availableTransitions.includes(transition)) {
      return transition;
    }
    else {
      return 'scroll';
    }
  },

  getBackdropContentElement() {
    return this.contentElements.findWhere({
      permaId: this.configuration.get('backdropContentElement')
    });
  }
});
