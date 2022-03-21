import Backbone from 'backbone';

import {ExternalLinkModel} from './ExternalLinkModel';

export const ExternalLinkCollection = Backbone.Collection.extend({
  model: ExternalLinkModel,
  comparator: 'position',

  initialize: function (models, options) {
    this.entry = options.entry;
    this.configuration = options.configuration;
    this.listenTo(this, 'add remove sort change', this.updateConfiguration);
  },

  modelId: function (attrs) {
    return attrs.id;
  },

  updateConfiguration: function () {
    this.configuration.set('links', this.toJSON());
  },

  addNewLink() {
    const id = this.length ? Math.max(...this.pluck('id')) + 1 : 1;

    this.add({
      id,
      title: '',
      url: '',
      thumbnail: '',
      description: '',
      open_in_new_tab: 1
    });

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
