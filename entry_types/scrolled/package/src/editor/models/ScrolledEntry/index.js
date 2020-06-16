import {Entry, editor} from 'pageflow/editor';

import {ChaptersCollection, SectionsCollection, ContentElementsCollection} from '../../collections';

import {insertContentElement} from './insertContentElement';
import {deleteContentElement} from './deleteContentElement';

export const ScrolledEntry = Entry.extend({
  setupFromEntryTypeSeed(seed) {
    this.contentElements = new ContentElementsCollection(seed.collections.contentElements);
    this.sections = new SectionsCollection(seed.collections.sections,
                                           {contentElements: this.contentElements});
    this.chapters = new ChaptersCollection(seed.collections.chapters,
                                           {sections: this.sections,
                                            entry: this});
    this.chapters.parentModel = this;

    this.sections.sort();

    editor.failures.watch(this.contentElements);
    editor.failures.watch(this.sections);
    editor.failures.watch(this.chapters);

    editor.savingRecords.watch(this.contentElements);
    editor.savingRecords.watch(this.sections);
    editor.savingRecords.watch(this.chapters);

    this.scrolledSeed = seed;
  },

  addChapter(attributes) {
    this.chapters.create({
      position: this.chapters.length,
      ...attributes
    }, {
      entry: this,
      sections: this.sections
    });
  },

  insertContentElement(attributes, {id, at, splitPoint}) {
    if (at === 'endOfSection') {
      const contentElement = this.sections.get(id).contentElements.create({
        position: this.contentElements.length,
        ...attributes
      });

      contentElement.once('sync', () => {
        this.trigger('selectContentElement', contentElement);
      });
    }
    else {
      insertContentElement(this,
                           this.contentElements.get(id),
                           attributes,
                           {id, at, splitPoint});
    }
  },

  deleteContentElement(id) {
    deleteContentElement(this, this.contentElements.get(id));
  }
});
