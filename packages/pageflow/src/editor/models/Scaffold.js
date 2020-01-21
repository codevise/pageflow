import Backbone from 'backbone';

import {Object} from 'pageflow/ui';

export const Scaffold = Object.extend({
  initialize: function(parent, options) {
    this.parent = parent;
    this.options = options || {};
  },

  create: function() {
    var scaffold = this;
    var query = this.options.depth ? '?depth=' + this.options.depth : '';

    this.model = this.build();

    Backbone.sync('create', this.model, {
      url: this.model.url() + '/scaffold' + query,

      success: function(response) {
        scaffold.load(response);
        scaffold.model.trigger('sync', scaffold.model, response, {});
      }
    });
  },

  build: function() {},

  load: function() {}
});