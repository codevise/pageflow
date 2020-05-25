import {features} from 'pageflow/frontend';
import {Entry} from 'pageflow/editor';
import {PreviewEntryData} from './PreviewEntryData';

export const PagedEntry = Entry.extend({
  setupFromEntryTypeSeed(seed, state){
    state.entryData = new PreviewEntryData({
      entry: this,
      storylines: state.storylines,
      chapters: state.chapters,
      pages: state.pages
    });
  },

  supportsPhoneEmulation: function() {
    return features.isEnabled('editor_emulation_mode')
  }
});
