import Marionette from 'backbone.marionette';

import {editor} from 'pageflow/editor';

import {EditChapterView} from '../views/EditChapterView';
import {EditPageLinkView} from '../views/EditPageLinkView';
import {EditPageView} from '../views/EditPageView';
import {EditStorylineView} from '../views/EditStorylineView';

export const SideBarController = Marionette.Controller.extend({
  initialize: function(options) {
    this.region = options.region;
    this.entry = options.entry;
  },

  storyline: function(id) {
    this.region.show(new EditStorylineView({
      model: this.entry.storylines.get(id)
    }));
  },

  chapter: function(id) {
    this.region.show(new EditChapterView({
      model: this.entry.chapters.get(id)
    }));
  },

  page: function(id, tab) {
    var page = this.entry.pages.get(id);

    this.region.show(new EditPageView({
      model: page,
      api: editor,
      tab: tab
    }));

    editor.setDefaultHelpEntry(page.pageType().help_entry_translation_key);
  },

  pageLink: function(linkId) {
    var pageId = linkId.split(':')[0];
    var page = this.entry.pages.getByPermaId(pageId);

    this.region.show(new EditPageLinkView({
      model: page.pageLinks().get(linkId),
      page: page,
      api: editor
    }));
  }
});
