pageflow.BackButtonDecoratorView = Backbone.Marionette.Layout.extend({
  template: 'templates/back_button_decorator',
  className: 'back_button_decorator',

  events: {
    'click a.back': 'goBack'
  },

  regions: {
    outlet: '.outlet'
  },

  onRender: function() {
    this.outlet.show(this.options.view);
  },

  goBack: function() {
    editor.navigate('/', {trigger: true});
  }
});
