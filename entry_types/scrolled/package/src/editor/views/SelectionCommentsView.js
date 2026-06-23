import React from 'react';

import {ThreadList, review} from 'pageflow-scrolled/review';

import {ReviewView} from './ReviewView';
import styles from './SelectionCommentsView.module.css';

export const SelectionCommentsView = ReviewView.extend({
  className: styles.root,

  initialize() {
    const {entry} = this.options;

    this.listenTo(entry,
                  'change:selectedCommentsSubject',
                  this._onSelectedChange);
    this.listenTo(entry,
                  'change:highlightedThreadId',
                  () => this.rerender());
    this._observeSubject();
  },

  props() {
    const {entry} = this.options;
    const subject = entry.get('selectedCommentsSubject');

    // Resolve the model from the current subject rather than the cached
    // `this._model`: a `change:highlightedThreadId` rerender can run
    // before `change:selectedCommentsSubject` refreshes `this._model`,
    // leaving a stale Section model paired with a new ContentElement
    // subject.
    const model = this._resolveModel();

    if (!subject || !model) {
      return {};
    }

    if (subject.subjectType === 'ContentElement') {
      const typeName = model.get('typeName');
      return {
        subjectType: 'ContentElement',
        subjectId: model.get('permaId'),
        threadIds: model.transientState.get('commentThreadIdsAtSelection'),
        compareRanges: typeName && review.contentElementTypes.findCompareRanges(typeName),
        highlightedThreadId: entry.get('highlightedThreadId'),
        onThreadClick: thread => entry.trigger('selectCommentThread', thread.id)
      };
    }

    return {
      subjectType: subject.subjectType,
      subjectId: model.get('permaId')
    };
  },

  // Highlight and per-thread click are only wired when the view is
  // scoped to a list of thread ids. For unscoped subjects (whole
  // content elements such as images, or whole sections) there is no
  // anchor for an individual thread in the iframe, so highlighting one
  // in the list would have no counterpart in the preview.
  renderContent({subjectType, subjectId, threadIds, compareRanges, highlightedThreadId, onThreadClick}) {
    if (!subjectType) return null;

    if (threadIds === undefined) {
      return (
        <ThreadList subjectType={subjectType}
                    subjectId={subjectId}
                    compareRanges={compareRanges}
                    showNewForm={false}
                    hideNewTopicButton />
      );
    }

    return (
      <ThreadList subjectType={subjectType}
                  subjectId={subjectId}
                  filter={thread => threadIds.includes(thread.id)}
                  compareRanges={compareRanges}
                  highlightedThreadId={highlightedThreadId}
                  onThreadClick={onThreadClick}
                  showNewForm={false}
                  hideNewTopicButton />
    );
  },

  _onSelectedChange() {
    this._observeSubject();
    this.rerender();
  },

  _observeSubject() {
    if (this._model?.transientState) {
      this.stopListening(this._model.transientState);
    }

    this._model = this._resolveModel();

    if (this._model?.transientState) {
      this.listenTo(this._model.transientState,
                    'change:commentThreadIdsAtSelection',
                    () => this.rerender());
    }
  },

  _resolveModel() {
    const {entry} = this.options;
    const subject = entry.get('selectedCommentsSubject');
    if (!subject) return null;

    return subject.subjectType === 'Section' ?
           entry.sections.get(subject.id) :
           entry.contentElements.get(subject.id);
  }
});
