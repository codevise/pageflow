import {Entry} from 'pageflow/editor';

import {ChaptersCollection, SectionsCollection, ContentElementsCollection} from '../collections';

export const ScrolledEntry = Entry.extend({
  setupFromEntryTypeSeed(seed) {
    this.chapters = new ChaptersCollection(seed.collections.chapters);
    this.sections = new SectionsCollection(seed.collections.sections);
    this.contentElements = new ContentElementsCollection(seed.collections.contentElements);
  }
});
