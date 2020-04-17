import Backbone from 'backbone';
import {log} from './base';

// TODO: rewrite to vanilla JS
var Settings = Backbone.Model.extend({
  defaults: {
    volume: 1
  },

  initialize: function() {
    var storage = this.getLocalStorage();

    if (storage) {
      if (storage['pageflow.settings']) {
        try {
          this.set(JSON.parse(storage['pageflow.settings']));
        }
        catch(e) {
          log(e);
        }
      }

      this.on('change', function() {
        storage['pageflow.settings'] = JSON.stringify(this);
      });
    }
  },

  getLocalStorage: function() {
    try {
      return window.localStorage;
    }
    catch(e) {
      // Safari throws SecurityError when accessing window.localStorage
      // if cookies/website data are disabled.
      return null;
    }
  }
});

export const settings = new Settings();