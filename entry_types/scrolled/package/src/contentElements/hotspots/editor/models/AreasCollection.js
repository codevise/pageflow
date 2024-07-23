import Backbone from 'backbone';
import _ from 'underscore';

import {Area} from './Area';

export const AreasCollection = Backbone.Collection.extend({
  model: Area,
  comparator: 'position',

  initialize(models, options) {
    this.entry = options.entry;
    this.contentElement = options.contentElement;

    this.listenTo(this, 'add change sort', this.updateConfiguration);
    this.listenTo(this, 'remove', () => this.updateConfiguration({pruneTooltips: true}));
  },

  updateConfiguration({pruneTooltips}) {
    let updatedAttributes = {areas: this.toJSON()};

    if (pruneTooltips) {
      updatedAttributes = {
        ...updatedAttributes,
        ...this.getPrunedProperty('tooltipTexts'),
        ...this.getPrunedProperty('tooltipLinks')
      };
    }

    this.contentElement.configuration.set(updatedAttributes);
  },

  getPrunedProperty(propertyName) {
    return {
      [propertyName]: _.pick(
        this.contentElement.configuration.get(propertyName) || {},
        ...this.pluck('id')
      )
    };
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
