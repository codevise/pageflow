import {Entry} from 'pageflow/editor';

export const ScrolledEntry = Entry.extend({
  setupFromEntryTypeSeed(seed) {
    this.scenes = seed;
  }
});
