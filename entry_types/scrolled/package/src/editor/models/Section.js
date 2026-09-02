import Backbone from 'backbone';
import I18n from 'i18n-js';
import {getAvailableTransitionNames} from 'pageflow-scrolled/frontend';

import {
  configurationContainer,
  entryTypeEditorControllerUrls,
  failureTracking,
  delayedDestroying,
  ForeignKeySubsetCollection
} from 'pageflow/editor';

import {configurationPlace} from './configurationPlace';
import sectionPictogram from '../views/images/sectionPictogram.svg';
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

  getConfigurationPlace(path) {
    return configurationPlace({
      chapter: this.chapter,
      subject: I18n.t('pageflow_scrolled.editor.configuration_places.section',
                      {number: this.chapter.sections.indexOf(this) + 1}),
      detail: I18n.t(`${editorAttributeName(path)}.label`, {
        scope: 'pageflow_scrolled.editor.edit_section.attributes'
      }),
      pictogram: sectionPictogram,
      select: () => {
        this.chapter.entry.trigger('selectSectionSettings', this);
        this.chapter.entry.trigger('scrollToSection', this, {ifNeeded: true});
      }
    });
  },

  getBackdropContentElement() {
    return this.contentElements.findWhere({
      permaId: this.configuration.get('backdropContentElement')
    });
  },

  isCurrent() {
    if (!this.chapter) {
      return false;
    }

    const entry = this.chapter.entry;
    const currentExcursionId = entry.get('currentExcursionId');
    const currentSectionIndex = entry.get('currentSectionIndex');

    if (currentExcursionId) {
      if (this.chapter.id !== currentExcursionId) {
        return false;
      }

      const sectionsInChapter = this.chapter.sections.models;
      const indexInChapter = sectionsInChapter.indexOf(this);

      return indexInChapter === currentSectionIndex;
    }
    else {
      return entry.sections.indexOf(this) === currentSectionIndex;
    }
  }
});

function editorAttributeName(path) {
  return path.map((segment, index) =>
    index ? `${segment[0].toUpperCase()}${segment.slice(1)}` : segment
  ).join('');
}
