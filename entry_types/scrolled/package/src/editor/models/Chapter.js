import Backbone from 'backbone';

export const Chapter = Backbone.Model.extend({
  initialize() {
    this.configuration = new Backbone.Model(this.get('configuration'));

    this.listenTo(this.configuration, 'change', function() {
      this.trigger('change:configuration', this);
    });
  }
});
