import _ from 'underscore';
import Object from './Object'
import {state} from './state';

export const HighlightedPage = Object.extend({
  initialize: function(entryData, options) {
    this.customNavigationBarMode = options && options.customNavigationBarMode;
    this.entry = entryData;
  },

  getPagePermaId: function(currentPagePermaId) {
    var storylineId = this.entry.getStorylineIdByPagePermaId(currentPagePermaId);

    if (this.getNavigationBarMode(storylineId) === 'inherit_from_parent') {
      var parentPagePermaId = this.entry.getParentPagePermaId(storylineId);

      return parentPagePermaId &&
        this.getPagePermaId(parentPagePermaId);
    }
    else {
      return this.getDisplayedPageInChapter(currentPagePermaId);
    }
  },

  getDisplayedPageInChapter: function(pagePermaId) {
    return _(this.getChapterPagesUntil(pagePermaId).reverse()).find(function(permaId) {
      return this.pageIsDisplayedInNavigation(permaId);
    }, this);
  },

  pageIsDisplayedInNavigation: function(permaId) {
    return this.entry.getPageConfiguration(permaId).display_in_navigation !== false;
  },

  getNavigationBarMode: function(storylineId) {
    if (this.customNavigationBarMode) {
      return this.customNavigationBarMode(storylineId, this.entry);
    }
    else {
      return this.entry.getStorylineConfiguration(storylineId).navigation_bar_mode;
    }
  },

  getChapterPagesUntil: function(pagePermaId) {
    var found = false;
    var chapterId = this.entry.getChapterIdByPagePermaId(pagePermaId);

    return _.filter(this.entry.getChapterPagePermaIds(chapterId), function(other) {
      var result = !found;
      found = found || (pagePermaId === other);
      return result;
    });
  }
});

HighlightedPage.create = function(options) {
  return new HighlightedPage(state.entryData, options);
};