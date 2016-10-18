pageflow.FileConfiguration = pageflow.Configuration.extend({
  defaults: {
  },

  applyUpdaters: function(updaters, newAttributes) {
    _(updaters).each(function(updater) {
      updater(this, newAttributes);
    }, this);
  }
});
