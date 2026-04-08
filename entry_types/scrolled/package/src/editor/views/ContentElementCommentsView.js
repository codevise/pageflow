import React from 'react';
import ReactDOM from 'react-dom';
import Marionette from 'backbone.marionette';

import {ReviewStateProvider, ReviewMessageHandler, ThreadList} from 'pageflow-scrolled/review';

import styles from './ContentElementCommentsView.module.css';

export const ContentElementCommentsView = Marionette.ItemView.extend({
  template: () => `<div class="${styles.container}"></div>`,

  onShow() {
    const session = this.options.entry.reviewSession;

    this.reviewMessageHandler = ReviewMessageHandler.create({
      session,
      targetWindow: window
    });

    ReactDOM.render(
      <ReviewStateProvider initialState={session.state}>
        <ThreadList subjectType="ContentElement"
                    subjectId={this.model.get('permaId')} />
      </ReviewStateProvider>,
      this.$el.find(`.${styles.container}`)[0]
    );
  },

  onClose() {
    this.reviewMessageHandler.dispose();
    ReactDOM.unmountComponentAtNode(this.$el.find(`.${styles.container}`)[0]);
  }
});
