import BackboneEvents from 'backbone-events-standalone';

export class ReviewSession {
  constructor({entryId, request, initialState = null}) {
    this._entryId = entryId;
    this._request = request;
    this._state = initialState;
  }

  get state() {
    return this._state;
  }

  async createThread({subjectType, subjectId, subjectRange, body}) {
    const thread = await this._request({
      url: `/review/entries/${this._entryId}/comment_threads`,
      method: 'POST',
      payload: {
        comment_thread: {
          subject_type: subjectType,
          subject_id: subjectId,
          ...(subjectRange && {subject_range: subjectRange}),
          comment: {body}
        }
      }
    });

    this._upsertThread(thread);
    this.trigger('change:thread', thread);
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

  async createComment({threadId, body}) {
    const comment = await this._request({
      url: `/review/entries/${this._entryId}/comment_threads/${threadId}/comments`,
      method: 'POST',
      payload: {comment: {body}}
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
