import _ from 'underscore';

import {Object} from 'pageflow/ui';

import {PageType} from './PageType';

export const PageTypes = Object.extend({
  initialize: function() {
    this.clientSideConfigs = {};
  },

  register: function(name, config) {
    if (this._setup) {
      throw 'Page types already set up. Register page types before initializers run.';
    }

    this.clientSideConfigs[name] = config;
  },

  setup: function(serverSideConfigs) {
    var clientSideConfigs = this.clientSideConfigs;
    this._setup = true;

    this.pageTypes = _.map(serverSideConfigs, function(serverSideConfig) {
      var clientSideConfig = clientSideConfigs[serverSideConfig.name] || {};
      return new PageType(serverSideConfig.name, clientSideConfig, serverSideConfig);
    });
  },

  findByName: function(name) {
     var result = this.find(function(pageType) {
      return pageType.name === name;
    });

    if (!result) {
      throw('Could not find page type with name "' + name +'"');
    }

    return result;
  },

  findByPage: function(page) {
    return this.findByName(page.get('template'));
  }
});

_.each(['each', 'map', 'reduce', 'first', 'find', 'pluck'], function(method) {
  PageTypes.prototype[method] = function() {
    if (!this._setup) {
      throw  'Page types are not yet set up.';
    }

    var args = Array.prototype.slice.call(arguments);
    args.unshift(this.pageTypes);
    return _[method].apply(_, args);
  };
});
