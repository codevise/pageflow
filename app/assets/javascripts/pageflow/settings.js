pageflow.Settings = Backbone.Model.extend({
  defaults: {
    volume: 1
  },

  initialize: function() {
    if (localStorage['pageflow.settings']) {
      try {
        this.set(JSON.parse(localStorage['pageflow.settings']));
      }
      catch(e) {
        pageflow.log(e);
      }
    }

    this.on('change', function() {
      localStorage['pageflow.settings'] = JSON.stringify(this);
    });
  }
});

pageflow.settings = new pageflow.Settings();