pageflow.ThemesCollection = Backbone.Collection.extend({
  model: pageflow.Theme,

  findByName: function(name) {
    var theme = this.findWhere({name: name});

    if (!theme) {
      throw new Error('Found no theme by name ' + name);
    }

    return theme;
  }
});
