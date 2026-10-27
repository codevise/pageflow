import Marionette from 'backbone.marionette';
import React from 'react';
import ReactDOM from 'react-dom';

import {StandaloneSectionThumbnail} from 'pageflow-scrolled/frontend';

export const FragmentThumbnailView = Marionette.ItemView.extend({
  template: () => '',

  onRender() {
    ReactDOM.render(
      React.createElement(StandaloneSectionThumbnail, {
        sectionPermaId: this.model.firstSectionPermaId(),
        seed: this.model.seed(this.options.entry.scrolledSeed, {section: this.options.section})
      }),
      this.el
    );
  },

  onClose() {
    ReactDOM.unmountComponentAtNode(this.el);
  }
});
