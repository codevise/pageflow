pageflow.DisabledAtmoIndicatorView = Backbone.Marionette.View.extend({
  className: 'disabled_atmo_indicator',

  events: {
    'click': function() {
      pageflow.atmo.enable();
    }
  },

  initialize: function() {
    this.listenTo(pageflow.events, 'atmo:disabled', function() {
      this.$el.show();
    });

    this.listenTo(pageflow.events, 'atmo:enabled', function() {
      this.$el.hide();
    });

    this.$el.toggle(pageflow.atmo.disabled);
  },

  render: function() {
    this.$el.attr('title', I18n.t('pageflow.editor.atmo.disabled'));

    return this;
  }
});
