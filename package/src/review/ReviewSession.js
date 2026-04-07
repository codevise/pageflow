import BackboneEvents from 'backbone-events-standalone';

export class ReviewSession {
  constructor({entryId, request}) {
    this._entryId = entryId;
    this._request = request;
    this._threads = {};
  }

  async createThread({subjectType, subjectId, body}) {
    const thread = await this._request({
      url: `/review/entries/${this._entryId}/comment_threads`,
      method: 'POST',
      payload: {
        comment_thread: {
          subject_type: subjectType,
          subject_id: subjectId,
          comment: {body}
        }
      }
    });

    this._threads[thread.id] = thread;
    this.trigger('change:thread', thread);
  }

  async createComment({threadId, body}) {
    const comment = await this._request({
      url: `/review/entries/${this._entryId}/comment_threads/${threadId}/comments`,
      method: 'POST',
      payload: {comment: {body}}
    });

    const thread = this._threads[threadId];

    if (thread) {
      this._threads[threadId] = {
        ...thread,
        comments: [...thread.comments, comment]
      };

      this.trigger('change:thread', this._threads[threadId]);
    }
  }

  async fetch() {
    const data = await this._request({
      url: `/review/entries/${this._entryId}/comment_threads`,
      method: 'GET'
    });

    data.commentThreads.forEach(thread => {
      this._threads[thread.id] = thread;
    });

    this.trigger('reset', {
      currentUser: data.currentUser,
      commentThreads: data.commentThreads
    });
  }
}

Object.assign(ReviewSession.prototype, BackboneEvents);
