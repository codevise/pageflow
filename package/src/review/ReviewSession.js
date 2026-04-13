import BackboneEvents from 'backbone-events-standalone';

export class ReviewSession {
  constructor({entryId, request}) {
    this._entryId = entryId;
    this._request = request;
  }

  async fetch() {
    const data = await this._request({
      url: `/review/entries/${this._entryId}/comment_threads`,
      method: 'GET'
    });

    this.trigger('reset', {
      currentUser: data.currentUser,
      commentThreads: data.commentThreads
    });
  }
}

Object.assign(ReviewSession.prototype, BackboneEvents);
