pageflow.HelpButtonView = Backbone.Marionette.ItemView.extend({
  template: 'templates/help_button',
  className: 'help_button',

  events: {
    'click': function() {
      pageflow.app.trigger('toggle-help');
    }
  }
});