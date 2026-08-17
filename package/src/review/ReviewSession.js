import BackboneEvents from 'backbone-events-standalone';

const FLUSH_READS_DELAY = 1000;

export class ReviewSession {
  constructor({entryId, request, initialState = null}) {
    this._entryId = entryId;
    this._request = request;
    this._state = initialState;
    this._drafts = {};
    this._pendingReads = new Set();
    this._flushReadsTimeout = null;
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

  setDraft({body, ...of}) {
    if (body.trim().length) {
      this._writeDraft({...of, body});
    }
    else {
      this._deleteDraft(of);
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
    this._writeDraft({threadId, body, pending: true});

    const comment = await this._request({
      url: `/review/entries/${this._entryId}/comment_threads/${threadId}/comments`,
      method: 'POST',
      payload: {comment: {body, ...(quote && {quote})}}
    }).catch(error => {
      this._writeDraft({threadId, body, pending: false});
      throw error;
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

    this._deleteDraft({threadId});
  }

  // Edits are not drafted: unlike a new comment, the text they would
  // restore is still in the thread, so a failed attempt only has to leave
  // the form showing what the reviewer typed.
  async updateComment({threadId, commentId, body}) {
    const comment = await this._request({
      url: `/review/entries/${this._entryId}/comment_threads/${threadId}/comments/${commentId}`,
      method: 'PATCH',
      payload: {comment: {body}}
    });

    const thread = this._findThread(threadId);

    if (!thread) return;

    const updatedThread = {
      ...thread,
      comments: thread.comments.map(c => (c.id === commentId ? comment : c))
    };

    this._upsertThread(updatedThread);
    this.trigger('change:thread', updatedThread);
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
      commentThreads: data.commentThreads,
      commentThreadReads: data.commentThreadReads || {}
    };

    this.trigger('reset', this._state);
  }

  // Read marks are frequent and individually unimportant, so they are
  // collected and sent as one request instead of one request per thread.
  markThreadsRead(permaIds) {
    if (!this._state || !permaIds.length) return;

    const readAt = new Date().toISOString();

    this._state = {
      ...this._state,
      commentThreadReads: {
        ...this._state.commentThreadReads,
        ...Object.fromEntries(permaIds.map(permaId => [permaId, readAt]))
      }
    };

    permaIds.forEach(permaId => this._pendingReads.add(permaId));

    this.trigger('change:reads', this._state.commentThreadReads);
    this._scheduleFlushReads();
  }

  async flushReads() {
    clearTimeout(this._flushReadsTimeout);
    this._flushReadsTimeout = null;

    if (!this._pendingReads.size) return;

    const permaIds = [...this._pendingReads];
    this._pendingReads.clear();

    await this._request({
      url: `/review/entries/${this._entryId}/comment_thread_reads`,
      method: 'POST',
      payload: {comment_thread_perma_ids: permaIds}
    }).catch(() => {
      // Local state already counts the threads as read. Keeping the
      // perma ids pending lets the next flush try again instead of
      // leaving them unread until the next page load.
      permaIds.forEach(permaId => this._pendingReads.add(permaId));
    });
  }

  _scheduleFlushReads() {
    if (this._flushReadsTimeout) return;

    this._flushReadsTimeout = setTimeout(() => this.flushReads(), FLUSH_READS_DELAY);
  }

  _writeDraft({body, pending = false, ...of}) {
    this._drafts = {
      ...this._drafts,
      [draftKey(of)]: {...of, body, pending}
    };

    this.trigger('change:drafts', this._drafts);
  }

  _deleteDraft(of) {
    const key = draftKey(of);

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

// Replies are drafted per thread, new threads per subject.
function draftKey({threadId, subjectType, subjectId}) {
  return threadId ? `Thread:${threadId}` : `${subjectType}:${subjectId}`;
}

function sameRange(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}
