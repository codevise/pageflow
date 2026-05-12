import React from 'react';

import {ThreadList} from 'pageflow-scrolled/review';

import {ReviewView} from './ReviewView';
import styles from './ContentElementCommentsView.module.css';

export const ContentElementCommentsView = ReviewView.extend({
  renderContent() {
    const {threadIds} = this.options;
    const filter = threadIds ? thread => threadIds.includes(thread.id) : undefined;

    return (
      <ThreadList subjectType="ContentElement"
                  subjectId={this.model.get('permaId')}
                  filter={filter}
                  newTopicButtonClassName={styles.newTopicButton} />
    );
  }
});
