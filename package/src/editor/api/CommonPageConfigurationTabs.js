import _ from 'underscore';

import {Object} from 'pageflow/ui';

export const CommonPageConfigurationTabs = Object.extend({
  initialize: function() {
    this.configureFns = {};
  },

  register: function(name, configureFn) {
    this.configureFns[name] = configureFn;
  },

  apply: function(configurationEditorView) {
    _.each(this.configureFns, function(configureFn, name) {
      configurationEditorView.tab(name, function() {
        configureFn.call(prefixInputDecorator(name, this));
      });
    });

    function prefixInputDecorator(name, dsl) {
      return {
        input: function(propertyName, view, options) {
          return dsl.input(name + '_' + propertyName, view, options);
        }
      };
    }
  }
});
