import Backbone from 'backbone';
import _ from 'underscore';

import {ExternalLinkModel} from './ExternalLinkModel';

export const ExternalLinkCollection = Backbone.Collection.extend({
  model: ExternalLinkModel,
  comparator: 'position',

  initialize: function (models, options) {
    this.entry = options.entry;
    this.configuration = options.configuration;
    this.listenTo(this, 'add sort change', this.updateConfiguration);
    this.listenTo(this, 'remove', () => this.updateConfiguration({prune: true}));
  },

  modelId: function (attrs) {
    return attrs.id;
  },

  updateConfiguration: function ({prune}) {
    let updatedAttributes = {links: this.toJSON()};

    if (prune) {
      updatedAttributes = {
        ...updatedAttributes,
        ...this.getPrunedProperty('itemTexts'),
        ...this.getPrunedProperty('itemLinks')
      };
    }

    this.configuration.set(updatedAttributes);
  },

  getPrunedProperty(propertyName) {
    return {
      [propertyName]: _.pick(
        this.configuration.get(propertyName) || {},
        ...this.pluck('id')
      )
    };
  },

  addNewLink() {
    const id = this.length ? Math.max(...this.pluck('id')) + 1 : 1;

    this.add({id});

    return this.get(id);
  },

  saveOrder() {}
});

ExternalLinkCollection.forContentElement = function(contentElement, entry) {
  return new ExternalLinkCollection(contentElement.configuration.get('links') || [], {
    entry: entry,
    configuration: contentElement.configuration
  });
};
