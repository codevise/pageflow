import Marionette from 'backbone.marionette';

import {editor as api} from 'pageflow/editor';

import {EditChapterView} from '../views/EditChapterView';
import {EditSectionView} from '../views/EditSectionView';

export const SideBarController = Marionette.Controller.extend({
  initialize: function(options) {
    this.region = options.region;
    this.entry = options.entry;
  },

  chapter: function(id, tab) {
    this.region.show(new EditChapterView({
      entry: this.entry,
      model: this.entry.chapters.get(id),
      api
    }));
  },

  section: function(id, tab) {
    this.region.show(new EditSectionView({
      entry: this.entry,
      model: this.entry.sections.get(id),
      api
    }));
  }
})
