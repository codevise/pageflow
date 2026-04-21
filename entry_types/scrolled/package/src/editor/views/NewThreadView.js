import React from 'react';

import {NewThreadForm} from 'pageflow-scrolled/review';

import {ReviewView} from './ReviewView';

export const NewThreadView = ReviewView.extend({
  renderContent() {
    const entry = this.options.entry;
    const {subjectType, subjectId, subjectRange} = this.options;

    const leave = () => entry.trigger('resetSelection');

    return (
      <NewThreadForm subjectType={subjectType}
                     subjectId={subjectId}
                     subjectRange={subjectRange}
                     onSubmit={leave}
                     onCancel={leave} />
    );
  }
});
