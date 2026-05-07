import React from 'react';

import {ThreadList} from 'pageflow-scrolled/review';

import {ReviewView} from './ReviewView';

export const ContentElementCommentsView = ReviewView.extend({
  initialize() {
    const {entry} = this.options;

    this.listenTo(entry,
                  'change:selectedContentElementCommentsId',
                  this._onSelectedChange);
    this.listenTo(entry,
                  'change:highlightedThreadId',
                  () => this.rerender());
    this._observeContentElement();
  },

  props() {
    const contentElement = this._contentElement;
    return {
      contentElement,
      threadIds: contentElement?.transientState.get('commentThreadIdsAtSelection'),
      highlightedThreadId: this.options.entry.get('highlightedThreadId'),
      onThreadClick: thread =>
        this.options.entry.trigger('selectCommentThread', thread.id)
    };
  },

  // Highlight and per-thread click are only wired when the view is
  // scoped to a list of thread ids. For unscoped content elements
  // there is no anchor for an individual thread in the iframe, so
  // highlighting one in the list would have no counterpart in the
  // preview.
  renderContent({contentElement, threadIds, highlightedThreadId, onThreadClick}) {
    if (!contentElement) return null;

    if (threadIds === undefined) {
      return (
        <ThreadList subjectType="ContentElement"
                    subjectId={contentElement.get('permaId')}
                    hideNewTopicButton />
      );
    }

    return (
      <ThreadList subjectType="ContentElement"
                  subjectId={contentElement.get('permaId')}
                  filter={thread => threadIds.includes(thread.id)}
                  highlightedThreadId={highlightedThreadId}
                  onThreadClick={onThreadClick}
                  hideNewTopicButton />
    );
  },

  _onSelectedChange() {
    this._observeContentElement();
    this.rerender();
  },

  _observeContentElement() {
    if (this._contentElement) {
      this.stopListening(this._contentElement.transientState);
    }

    const id = this.options.entry.get('selectedContentElementCommentsId');
    this._contentElement = id ? this.options.entry.contentElements.get(id) : null;

    if (this._contentElement) {
      this.listenTo(this._contentElement.transientState,
                    'change:commentThreadIdsAtSelection',
                    () => this.rerender());
    }
  }
});
