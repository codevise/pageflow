import React from 'react';

import {ThreadList} from 'pageflow-scrolled/review';

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
    this.listenTo(entry.commentDisplayFilter,
                  'change:resolution',
                  () => this.rerender());
    this._observeSubject();
  },

  props() {
    const {entry} = this.options;
    const subject = entry.get('selectedCommentsSubject');

    // A `change:highlightedThreadId` rerender can run before
    // `change:selectedCommentsSubject` has refreshed `this._model`.
    const model = this._resolveModel();

    if (!subject || !model) {
      return {};
    }

    const expandResolved = entry.commentDisplayFilter.showsResolved();

    if (subject.subjectType === 'ContentElement') {
      return {
        subjectType: 'ContentElement',
        subjectId: model.get('permaId'),
        threadIds: model.transientState.get('commentThreadIdsAtSelection'),
        highlightedThreadId: entry.get('highlightedThreadId'),
        expandResolved,
        onThreadClick: thread => entry.trigger('selectCommentThread', thread.id)
      };
    }

    return {
      subjectType: subject.subjectType,
      subjectId: model.get('permaId'),
      expandResolved
    };
  },

  renderContent({subjectType, subjectId, threadIds, highlightedThreadId, expandResolved, onThreadClick}) {
    if (!subjectType) return null;

    if (threadIds === undefined) {
      return (
        <ThreadList subjectType={subjectType}
                    subjectId={subjectId}
                    expandResolved={expandResolved}
                    showNewForm={false}
                    hideNewTopicButton />
      );
    }

    return (
      <ThreadList subjectType={subjectType}
                  subjectId={subjectId}
                  filter={thread => threadIds.includes(thread.id)}
                  highlightedThreadId={highlightedThreadId}
                  expandResolved={expandResolved}
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
