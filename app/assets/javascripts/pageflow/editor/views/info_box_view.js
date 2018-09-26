pageflow.InfoBoxView = Backbone.Marionette.View.extend({
  className: 'info_box',

  render: function() {
    this.$el.text(this.options.text);
    return this;
  }
});
