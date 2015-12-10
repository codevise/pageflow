pageflow.PagesCollection = Backbone.Collection.extend({
  model: pageflow.Page,

  url: '/pages',

  comparator: function(pageA, pageB) {
    if (pageA.storylinePosition() > pageB.storylinePosition()) {
      return 1;
    }
    else if (pageA.storylinePosition() < pageB.storylinePosition()) {
      return -1;
    }
    else if (pageA.chapterPosition() > pageB.chapterPosition()) {
      return 1;
    }
    else if (pageA.chapterPosition() < pageB.chapterPosition()) {
      return -1;
    }
    else if (pageA.get('position') > pageB.get('position')) {
      return 1;
    }
    else if (pageA.get('position') < pageB.get('position')) {
      return -1;
    }
    else {
      return 0;
    }
  },

  getByPermaId: function(permaId) {
    return this.findWhere({perma_id: parseInt(permaId, 10)});
  }
});
