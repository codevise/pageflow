import I18n from 'i18n-js';
import Marionette from 'backbone.marionette';

export const DisabledAtmoIndicatorView = Marionette.View.extend({
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

    this.$el.toggle(!!pageflow.atmo && pageflow.atmo.disabled);
  },

  render: function() {
    this.$el.attr('title', I18n.t('pageflow.editor.atmo.disabled'));

    return this;
  }
});
