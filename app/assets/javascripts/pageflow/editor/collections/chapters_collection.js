pageflow.ChaptersCollection = Backbone.Collection.extend({
  model: pageflow.Chapter,

  mixins: [pageflow.orderedCollection],

  url: function() {
    return '/entries/' + pageflow.entry.get('id') + '/chapters';
  },

  comparator: function(chapter) {
    return chapter.get('position');
  }
});