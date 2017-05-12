pageflow.ThemesCollection = Backbone.Collection.extend({
  model: pageflow.Theme,

  findByName: function(name) {
    return this.findWhere({name: name});
  }
});
