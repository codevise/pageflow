pageflow.StorylinesCollection = Backbone.Collection.extend({
  model: pageflow.Storyline,

  url: function() {
    return '/entries/' + pageflow.entry.get('id') + '/storylines';
  },
});