pageflow.ChaptersCollection = Backbone.Collection.extend({
  model: pageflow.Chapter,

  url:  '/chapters',

  comparator: function(chapter) {
    return chapter.get('position');
  }
});
