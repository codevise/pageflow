import React from 'react';
import ReactDOM from 'react-dom';
import Marionette from 'backbone.marionette';

import {ReviewStateProvider, ReviewMessageHandler} from 'pageflow-scrolled/review';

import styles from './ReviewView.module.css';

// Base Marionette view for comment-related sidebar panels. Provides the
// shared wiring: a container div, a ReviewMessageHandler bridging the
// session to the preview iframe, and a ReviewStateProvider seeded from
// the current session state. Subclasses implement `renderContent()` to
// return the React subtree.
export const ReviewView = Marionette.ItemView.extend({
  template: () => `<div class="${styles.container}"></div>`,

  onShow() {
    const session = this.options.entry.reviewSession;

    this.reviewMessageHandler = ReviewMessageHandler.create({
      session,
      targetWindow: window
    });

    ReactDOM.render(
      <ReviewStateProvider initialState={session.state}>
        {this.renderContent()}
      </ReviewStateProvider>,
      this._containerEl()
    );
  },

  onClose() {
    this.reviewMessageHandler.dispose();
    ReactDOM.unmountComponentAtNode(this._containerEl());
  },

  _containerEl() {
    return this.$el.find(`.${styles.container}`)[0];
  }
});
