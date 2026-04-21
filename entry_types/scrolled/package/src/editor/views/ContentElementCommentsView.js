import React from 'react';

import {ThreadList} from 'pageflow-scrolled/review';

import {ReviewView} from './ReviewView';
import styles from './ContentElementCommentsView.module.css';

export const ContentElementCommentsView = ReviewView.extend({
  renderContent() {
    return (
      <ThreadList subjectType="ContentElement"
                  subjectId={this.model.get('permaId')}
                  newTopicButtonClassName={styles.newTopicButton} />
    );
  }
});
