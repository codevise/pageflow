import BackboneEvents from 'backbone-events-standalone';

export class ReviewSession {
  constructor({entryId, request, initialState = null}) {
    this._entryId = entryId;
    this._request = request;
    this._state = initialState;
    this._drafts = {};
  }

  get state() {
    return this._state;
  }

  // Unsent comment texts, not keyed by subject range: a draft written
  // about one phrase of a text block is offered again when commenting on
  // another phrase of the same block.
  get drafts() {
    return this._drafts;
  }

  setDraft({subjectType, subjectId, body}) {
    if (body.trim().length) {
      this._writeDraft({subjectType, subjectId, body});
    }
    else {
      this._deleteDraft({subjectType, subjectId});
    }
  }

  async createThread({
    subjectType, subjectId, subjectRange, sectionPermaId, body, quote
  }) {
    // Written even when the form never stored a draft, so that the text
    // outlives a failed attempt.
    this._writeDraft({subjectType, subjectId, body, pending: true});

    const thread = await this._request({
      url: `/review/entries/${this._entryId}/comment_threads`,
      method: 'POST',
      payload: {
        comment_thread: {
          subject_type: subjectType,
          subject_id: subjectId,
          ...(subjectRange && {subject_range: subjectRange}),
          ...(sectionPermaId != null && {section_perma_id: sectionPermaId}),
          comment: {body, ...(quote && {quote})}
        }
      }
    }).catch(error => {
      this._writeDraft({subjectType, subjectId, body, pending: false});
      // Rethrown so that a failure still shows up as an unhandled
      // rejection rather than only as a form that became editable again.
      throw error;
    });

    this._upsertThread(thread);
    this.trigger('change:thread', thread);
    this.trigger('create:thread', thread);

    // Dropped last so that the form closing does not briefly reveal a
    // list without the thread.
    this._deleteDraft({subjectType, subjectId});
  }

  async updateThread({threadId, resolved}) {
    const thread = await this._request({
      url: `/review/entries/${this._entryId}/comment_threads/${threadId}`,
      method: 'PATCH',
      payload: {comment_thread: {resolved}}
    });

    this._upsertThread(thread);
    this.trigger('change:thread', thread);
  }

  async createComment({threadId, body, quote}) {
    const comment = await this._request({
      url: `/review/entries/${this._entryId}/comment_threads/${threadId}/comments`,
      method: 'POST',
      payload: {comment: {body, ...(quote && {quote})}}
    });

    const thread = this._findThread(threadId);

    if (thread) {
      const updatedThread = {
        ...thread,
        comments: [...thread.comments, comment]
      };

      this._upsertThread(updatedThread);
      this.trigger('change:thread', updatedThread);
    }
  }

  diffSubjectRangeUpdates(ranges) {
    const changed = {};

    if (!this._state) return changed;

    Object.entries(ranges).forEach(([id, range]) => {
      const threadId = Number(id);
      const thread = this._findThread(threadId);

      if (!thread || sameRange(thread.subjectRange, range)) return;

      changed[threadId] = range;
    });

    return changed;
  }

  applySubjectRangeUpdates(ranges) {
    const updates = {};
    Object.entries(ranges).forEach(([id, range]) => {
      updates[id] = {subjectRange: range};
    });
    this.applyThreadUpdates(updates);
  }

  applyThreadUpdates(updates) {
    if (!this._state) return;

    Object.entries(updates).forEach(([id, changes]) => {
      const threadId = Number(id);
      const thread = this._findThread(threadId);

      if (!thread) return;

      const updated = {...thread, ...changes};
      this._upsertThread(updated);
      this.trigger('change:thread', updated);
    });
  }

  findThreadsFor({subjectType, subjectId}) {
    if (!this._state) return [];

    return this._state.commentThreads.filter(
      thread => thread.subjectType === subjectType &&
                thread.subjectId === subjectId
    );
  }

  async fetch() {
    const data = await this._request({
      url: `/review/entries/${this._entryId}/comment_threads`,
      method: 'GET'
    });

    this._state = {
      currentUser: data.currentUser,
      commentThreads: data.commentThreads
    };

    this.trigger('reset', this._state);
  }

  _writeDraft({subjectType, subjectId, body, pending = false}) {
    this._drafts = {
      ...this._drafts,
      [draftKey({subjectType, subjectId})]: {subjectType, subjectId, body, pending}
    };

    this.trigger('change:drafts', this._drafts);
  }

  _deleteDraft({subjectType, subjectId}) {
    const key = draftKey({subjectType, subjectId});

    if (!(key in this._drafts)) return;

    this._drafts = {...this._drafts};
    delete this._drafts[key];

    this.trigger('change:drafts', this._drafts);
  }

  _findThread(id) {
    return this._state?.commentThreads.find(t => t.id === id);
  }

  _upsertThread(thread) {
    if (!this._state) return;

    const threads = this._state.commentThreads;
    const index = threads.findIndex(t => t.id === thread.id);

    if (index >= 0) {
      this._state = {
        ...this._state,
        commentThreads: [
          ...threads.slice(0, index),
          thread,
          ...threads.slice(index + 1)
        ]
      };
    }
    else {
      this._state = {
        ...this._state,
        commentThreads: [...threads, thread]
      };
    }
  }
}

Object.assign(ReviewSession.prototype, BackboneEvents);

function draftKey({subjectType, subjectId}) {
  return `${subjectType}:${subjectId}`;
}

function sameRange(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}
