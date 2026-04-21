import React from 'react';

import {Thread, useCommentThread} from 'pageflow-scrolled/review';

import {ReviewView} from './ReviewView';

export const CommentThreadView = ReviewView.extend({
  renderContent() {
    return <SelectedThread threadId={this.options.threadId} />;
  }
});

function SelectedThread({threadId}) {
  const thread = useCommentThread(threadId);

  if (!thread) return null;

  return <Thread thread={thread} />;
}
