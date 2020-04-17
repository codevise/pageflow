import I18n from 'i18n-js';
import Marionette from 'backbone.marionette';

import {events} from 'pageflow/frontend';
import {state} from '$state';

export const DisabledAtmoIndicatorView = Marionette.View.extend({
  className: 'disabled_atmo_indicator',

  events: {
    'click': function() {
      state.atmo.enable();
    }
  },

  initialize: function() {
    this.listenTo(events, 'atmo:disabled', function() {
      this.$el.show();
    });

    this.listenTo(events, 'atmo:enabled', function() {
      this.$el.hide();
    });

    this.$el.toggle(state.atmo.disabled);
  },

  render: function() {
    this.$el.attr('title', I18n.t('pageflow.editor.atmo.disabled'));

    return this;
  }
});
