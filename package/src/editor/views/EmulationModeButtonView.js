import Marionette from 'backbone.marionette';

import template from '../templates/emulationModeButton.jst';

export const EmulationModeButtonView = Marionette.ItemView.extend({
  template,
  className: 'emulation_mode_button',

  ui: {
    phoneItem: '.emulation_mode_button-phone',
    desktopItem: '.emulation_mode_button-desktop',

    phoneDisplay: '.emulation_mode_button-display.emulation_mode_button-phone',
    desktopDisplay: '.emulation_mode_button-display.emulation_mode_button-desktop'
  },

  events: {
    'click .emulation_mode_button-desktop a': function() {
      this.model.unset('emulation_mode');
    },

    'click .emulation_mode_button-phone a': function() {
      if (this.model.get('emulation_mode_disabled')) {
        return;
      }

      this.model.set('emulation_mode', 'phone');
    }
  },

  modelEvents: {
    'change:emulation_mode change:emulation_mode_disabled': 'update'
  },

  onRender: function() {
    this.update();
  },

  update: function() {
    this.ui.phoneItem.toggleClass('disabled',
                                  !!this.model.get('emulation_mode_disabled'));

    this.ui.phoneItem.toggleClass('active', this.model.has('emulation_mode'));
    this.ui.desktopItem.toggleClass('active', !this.model.has('emulation_mode'));

    this.ui.phoneDisplay.toggleClass('active', this.model.has('emulation_mode'));
    this.ui.desktopDisplay.toggleClass('active', !this.model.has('emulation_mode'));
  }
});
