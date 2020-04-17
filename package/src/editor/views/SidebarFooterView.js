import Marionette from 'backbone.marionette';
import {features} from 'pageflow/frontend';

import {EmulationModeButtonView} from './EmulationModeButtonView';
import {HelpButtonView} from './HelpButtonView';

export const SidebarFooterView = Marionette.View.extend({
  className: 'sidebar_footer',

  render: function() {
    if (features.isEnabled('editor_emulation_mode')) {
      this.appendSubview(new EmulationModeButtonView({model: this.model}));
    }

    this.appendSubview(new HelpButtonView());
    return this;
  }
});
