pageflow.ScrollingView = Backbone.Marionette.View.extend({

  events: {
    scroll: function() {
      if (this._isChapterView()) {
        this.scrollpos = this.$el.scrollTop();
      }
    }
  },

  initialize: function() {
    this.scrollpos = 0;

    this.listenTo(this.options.region, 'show', function() {
      if (this._isChapterView()) {
        this.$el.scrollTop(this.scrollpos);
      }
    });
  },

  _isChapterView: function() {
    return !Backbone.history.getFragment();
  }
});
