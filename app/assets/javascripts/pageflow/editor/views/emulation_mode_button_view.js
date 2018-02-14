pageflow.EmulationModeButtonView = Backbone.Marionette.ItemView.extend({
  template: 'templates/emulation_mode_button',
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
      if (!this.model.get('current_page_supports_emulation_mode')) {
        return;
      }

      this.model.set('emulation_mode', 'phone');
    }
  },

  modelEvents: {
    'change:emulation_mode change:current_page_supports_emulation_mode': 'update'
  },

  onRender: function() {
    this.update();
  },

  update: function() {
    this.ui.phoneItem.toggleClass('disabled',
                                  !this.model.get('current_page_supports_emulation_mode'));

    this.ui.phoneItem.toggleClass('active', this.model.has('emulation_mode'));
    this.ui.desktopItem.toggleClass('active', !this.model.has('emulation_mode'));

    this.ui.phoneDisplay.toggleClass('active', this.model.has('emulation_mode'));
    this.ui.desktopDisplay.toggleClass('active', !this.model.has('emulation_mode'));
  }
});