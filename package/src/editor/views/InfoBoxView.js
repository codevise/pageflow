import Marionette from 'backbone.marionette';

export const InfoBoxView = Marionette.View.extend({
  className: 'info_box',

  render: function() {
    this.$el.addClass(this.options.level)
    this.$el.html(this.options.text);
    return this;
  }
});
