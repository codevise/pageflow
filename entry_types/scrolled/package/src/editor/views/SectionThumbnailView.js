import Marionette from 'backbone.marionette';
import React from 'react';
import ReactDOM from 'react-dom';

import {cssModulesUtils} from 'pageflow/ui';
import {watchCollections} from '../../entryState';
import {SectionThumbnail} from 'pageflow-scrolled/frontend'

import styles from './SectionThumbnailView.module.css';

export const SectionThumbnailView = Marionette.ItemView.extend({
  template: () => `
    <div class=${styles.thumbnail} inert></div>
  `,

  ui: cssModulesUtils.ui(styles, 'thumbnail'),

  modelEvents: {
    'change:id': 'renderThumbnail'
  },

  onRender() {
    this.timeout = setTimeout(() => {
      this.renderThumbnail();
    }, 100);
  },

  onClose() {
    clearTimeout(this.timeout);
    ReactDOM.unmountComponentAtNode(this.ui.thumbnail[0]);
  },

  renderThumbnail() {
    if (!this.model.isNew()) {
      ReactDOM.render(React.createElement(SectionThumbnail,
                                          {
                                            sectionPermaId: this.model.get('permaId'),
                                            seed: this.options.entry.scrolledSeed,
                                            subscribe: dispatch =>
                                              watchCollections(this.options.entry, {dispatch})
                                          }),
                      this.ui.thumbnail[0]);
    }
  }
});