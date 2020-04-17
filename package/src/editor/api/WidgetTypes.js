import _ from 'underscore';

import {Object} from 'pageflow/ui';

import {WidgetType} from './WidgetType';

export const WidgetTypes = Object.extend({
  initialize: function() {
    this._clientSideConfigs = {};
    this._optionalRoles = {};
  },

  register: function(name, config) {
    if (this._setup) {
      throw 'Widget types already set up. Register widget types before initializers run.';
    }

    this._clientSideConfigs[name] = config;
  },

  setup: function(serverSideConfigsByRole) {
    this._setup = true;
    this._widgetTypesByName = {};

    var roles = _.keys(serverSideConfigsByRole);

    this._widgetTypesByRole = roles.reduce(_.bind(function(result, role) {
      result[role] = serverSideConfigsByRole[role].map(_.bind(function(serverSideConfig) {
        var clientSideConfig = this._clientSideConfigs[serverSideConfig.name] || {};
        var widgetType = new WidgetType(serverSideConfig, clientSideConfig);

        this._widgetTypesByName[serverSideConfig.name] = widgetType;
        return widgetType;
      }, this));

      return result;
    }, this), {});
  },

  findAllByRole: function(role) {
    return this._widgetTypesByRole[role] || [];
  },

  findByName: function(name) {
    if (!this._widgetTypesByName[name]) {
      throw('Could not find widget type with name "' + name +'"');
    }

    return this._widgetTypesByName[name];
  },

  registerRole: function(role, options) {
    this._optionalRoles[role] = options.isOptional;
  },

  isOptional: function(role) {
    return !!this._optionalRoles[role];
  }
});
