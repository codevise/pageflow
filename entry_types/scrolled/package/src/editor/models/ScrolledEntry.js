import {Entry, editor} from 'pageflow/editor';

import {ChaptersCollection, SectionsCollection, ContentElementsCollection} from '../collections';

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

  insertContentElement(attributes, {position, id}) {
    const sibling = this.contentElements.get(id);
    const section = sibling.section
    let delta = 0;

    section.contentElements.each(function(contentElement, index) {
      if (contentElement === sibling && position === 'before') {
        delta = 1;
      }

      contentElement.set('position', index + delta);

      if (contentElement === sibling && position === 'after') {
        delta = 1;
      }
    });

    var newContentElement = section.contentElements.create({
      position: sibling.get('position') + (position === 'before' ? -1 : 1),
      ...attributes,
      configuration: {
        position: sibling.configuration.get('position')
      }
    });

    section.contentElements.sort();

    newContentElement.once('sync', () => {
      section.contentElements.saveOrder();
      this.trigger('selectContentElement', newContentElement);
    });
  }
});
