import Backbone from 'backbone';

import {Area} from './Area';

export const AreasCollection = Backbone.Collection.extend({
  model: Area,
  comparator: 'position',

  initialize(models, options) {
    this.entry = options.entry;
    this.contentElement = options.contentElement;

    this.listenTo(this, 'add remove change sort', this.updateConfiguration);
  },

  updateConfiguration() {
    this.contentElement.configuration.set('areas', this.toJSON());
  },

  addWithId(model) {
    model.set('id', this.length ? Math.max(...this.pluck('id')) + 1 : 1);
    this.add(model);
  },

  saveOrder() {}
});

AreasCollection.forContentElement = function(contentElement, entry) {
  return new AreasCollection(contentElement.configuration.get('areas') || [], {
    entry: entry,
    contentElement: contentElement
  });
};
