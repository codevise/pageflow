pageflow.StorylinesCollection = Backbone.Collection.extend({
  autoConsolidatePositions: false,

  mixins: [pageflow.orderedCollection],

  model: pageflow.Storyline,

  url: function() {
    return '/entries/' + pageflow.entry.get('id') + '/storylines';
  },

  initialize: function() {
    this.listenTo(this, 'change:main', function(model, value) {
      if (value) {
        this.each(function(storyline) {
          if (storyline.isMain() && storyline !== model) {
            storyline.configuration.unset('main');
          }
        });
      }
    });
  },

  main: function() {
    return this.find(function(storyline) {
      return storyline.configuration.get('main');
    }) || this.first();
  },

  comparator: function(chapter) {
    return chapter.get('position');
  }
});