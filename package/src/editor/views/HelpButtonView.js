import Marionette from 'backbone.marionette';

import {app} from '../app';

import template from '../templates/helpButton.jst';

export const HelpButtonView = Marionette.ItemView.extend({
  template,
  className: 'help_button',

  events: {
    'click': function() {
      app.trigger('toggle-help');
    }
  }
});