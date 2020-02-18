import Marionette from 'backbone.marionette';

import {editor} from 'pageflow-scrolled/editor';

import {EditChapterView} from '../views/EditChapterView';
import {EditSectionView} from '../views/EditSectionView';
import {EditContentElementView} from '../views/EditContentElementView';
import {InsertContentElementView} from '../views/InsertContentElementView';

export const SideBarController = Marionette.Controller.extend({
  initialize: function(options) {
    this.region = options.region;
    this.entry = options.entry;
  },

  chapter: function(id, tab) {
    this.region.show(new EditChapterView({
      entry: this.entry,
      model: this.entry.chapters.get(id),
      editor
    }));
  },

  section: function(id, tab) {
    this.region.show(new EditSectionView({
      entry: this.entry,
      model: this.entry.sections.get(id),
      editor
    }));
  },

  contentElement: function(id, tab) {
    this.region.show(new EditContentElementView({
      entry: this.entry,
      model: this.entry.contentElements.get(id),
      editor
    }));
  },

  insertContentElement: function(position, id) {
    this.region.show(InsertContentElementView.create({
      entry: this.entry,
      insertOptions: {
        position,
        id
      },
      editor
    }));
  }
});
