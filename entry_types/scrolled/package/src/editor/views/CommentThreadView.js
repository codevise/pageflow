import React from 'react';

import {Thread, useCommentThread, postUpdateThreadMessage} from 'pageflow-scrolled/review';

import {ReviewView} from './ReviewView';

export const CommentThreadView = ReviewView.extend({
  renderContent() {
    const entry = this.options.entry;
    const threadId = this.options.threadId;

    const handleResolve = () => {
      postUpdateThreadMessage({threadId, resolved: true});
      entry.trigger('resetSelection');
    };

    return <SelectedThread threadId={threadId} onResolve={handleResolve} />;
  }
});

function SelectedThread({threadId, onResolve}) {
  const thread = useCommentThread(threadId);

  if (!thread) return null;

  return <Thread thread={thread} onResolve={onResolve} />;
}
