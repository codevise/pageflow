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
    const id = this.get('currentId');

    if (id != null) {
      this.trigger(`selected:${id}`);
    }
  },

  _move(delta) {
    const collection = this.collection;
    const length = collection.length;

    if (!length) {
      return;
    }

    const currentId = this.get('currentId');
    const currentModel = currentId != null ? collection.get(currentId) : null;
    let index = currentModel ? collection.indexOf(currentModel) : -1;

    if (index === -1) {
      index = delta > 0 ? 0 : length - 1;
    }
    else {
      index = (index + delta + length) % length;
    }

    this.set('currentId', collection.at(index).id);
  }
});
