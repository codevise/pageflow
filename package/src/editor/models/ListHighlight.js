import Backbone from 'backbone';

export const ListHighlight = Backbone.Model.extend({
  defaults: {
    active: false,
  },

  initialize(attrs, options = {}) {
    this.collection = options.collection;
  },

  next() {
    this._move(1);
  },

  previous() {
    this._move(-1);
  },

  triggerSelect() {
    const cid = this.get('currentCid');

    if (cid != null) {
      this.trigger(`selected:${cid}`);
    }
  },

  _move(delta) {
    const collection = this.collection;
    const length = collection.length;

    if (!length) {
      return;
    }

    const currentCid = this.get('currentCid');
    let index = collection.models.findIndex(model => model.cid === currentCid);

    if (index === -1) {
      index = delta > 0 ? 0 : length - 1;
    }
    else {
      index = (index + delta + length) % length;
    }

    this.set('currentCid', collection.at(index).cid);
  }
});
