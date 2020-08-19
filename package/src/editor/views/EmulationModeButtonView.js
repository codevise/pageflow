import Marionette from 'backbone.marionette';
import {tooltipContainer} from 'pageflow/ui';

import template from '../templates/emulationModeButton.jst';

export const EmulationModeButtonView = Marionette.ItemView.extend({
  template,
  className: 'emulation_mode_button',

  mixins: [tooltipContainer],

  ui: {
    wrapper: '.emulation_mode_button-wrapper',
    desktopIcon: '.emulation_mode_button-desktop_icon',
    phoneIcon: '.emulation_mode_button-phone_icon'
  },

  events: {
    'click': function() {
      if (this.model.get('emulation_mode_disabled')) {
        return;
      }

      if (this.model.has('emulation_mode')) {
        this.model.unset('emulation_mode');
      }
      else {
        this.model.set('emulation_mode', 'phone');
      }
    }
  },

  modelEvents: {
    'change:emulation_mode change:emulation_mode_disabled': 'update'
  },

  onRender: function() {
    this.update();
  },

  update: function() {
    this.$el.toggleClass('disabled',
                         !!this.model.get('emulation_mode_disabled'));
    this.$el.toggleClass('active', this.model.has('emulation_mode'));

    this.ui.wrapper.attr('data-tooltip',
                         this.model.get('emulation_mode_disabled') ?
                         'pageflow.editor.templates.emulation_mode_button.disabled_hint' :
                         'pageflow.editor.templates.emulation_mode_button.tooltip')
  }
});
