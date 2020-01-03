import {Entry} from 'pageflow/editor';

import {SectionsCollection, ContentElementsCollection} from '../collections';

export const ScrolledEntry = Entry.extend({
  setupFromEntryTypeSeed(seed) {
    this.sections = new SectionsCollection(seed.sections);
    this.contentElements = new ContentElementsCollection(seed.contentElements);
  }
});
