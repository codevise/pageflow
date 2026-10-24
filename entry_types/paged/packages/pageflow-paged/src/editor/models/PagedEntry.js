import {features} from 'pageflow/frontend';
import {Entry} from 'pageflow/editor';
import {PreviewEntryData} from './PreviewEntryData';

export const PagedEntry = Entry.extend({
  setupFromEntryTypeSeed(seed, state){
    this.themeStylesheetPaths = seed.theme_stylesheet_paths;

    state.entryData = new PreviewEntryData({
      entry: this,
      storylines: state.storylines,
      chapters: state.chapters,
      pages: state.pages
    });
  },

  getThemeStylesheetPath: function() {
    return this.themeStylesheetPaths[this.metadata.get('theme_name')];
  },

  supportsPhoneEmulation: function() {
    return features.isEnabled('editor_emulation_mode')
  }
});
