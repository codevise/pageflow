import {Entry} from 'pageflow/editor';
import {PreviewEntryData} from './PreviewEntryData';

export const PagedEntry = Entry.extend({
  setupFromEntryTypeSeed(seed, state, entry){
    state.entryData = new PreviewEntryData({
      entry: entry,
      storylines: state.storylines,
      chapters: state.chapters,
      pages: state.pages
    });
  }
});
