import Backbone from 'backbone';

import {ExternalLinkModel} from './ExternalLinkModel';

export const ExternalLinkCollection = Backbone.Collection.extend({
  model: ExternalLinkModel,
  initialize: function (models, options) {
    this.entry = options.entry;
    this.configuration = options.configuration;
    this.bind('change', this.updateConfiguration);
    this.bind('add', this.updateConfiguration);
    this.bind('remove', this.updateConfiguration);
  },
  modelId: function (attrs) {
    return attrs.id;
  },
  updateConfiguration: function () {
    this.configuration.set('links', this.toJSON(), {silent: true});
    setTimeout(() => {
      //triggering change event inside this timeout block because otherwise due to
      //some unknown reason page navigates to window.location.origin+window.location.pathname
      //ignoring the hash thus causing the page to refresh.
      this.configuration.trigger('change');
    }, 0);
  },
  addNewLink: function(){
    var newLink = {
      id: this.length+1,
      title: '',
      url: '',
      thumbnail: '',
      description: '',
      open_in_new_tab: 1
    }
    this.add(newLink);
    return this.get(this.length);
  }
});