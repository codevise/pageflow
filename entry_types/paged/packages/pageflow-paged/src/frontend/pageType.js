import Backbone from 'backbone';
import _ from 'underscore';

export * from './page_types/mixins/commonPageCssClasses';
export * from './page_types/mixins/defaultPageContent';
export * from './page_types/mixins/infoBox';
export * from './page_types/mixins/videoHelpers';
export * from './page_types/mixins/volumeFade';

export const pageType = (function() {
  var base = {
    enhance: function(pageElement, configuarion) {},
    prepare: function(pageElement, configuarion) {},
    unprepare: function(pageElement, configuarion) {},
    preload: function(pageElement, configuarion) {},
    resize: function(pageElement, configuarion) {},
    activating: function(pageElement, configuarion) {},
    activated: function(pageElement, configuarion) {},
    deactivating: function(pageElement, configuarion) {},
    deactivated: function(pageElement, configuarion) {},
    update: function(pageElement, configuarion) {},
    cleanup: function(pageElement, configuarion) {},

    embeddedEditorViews: function() {},

    linkedPages: function() {
      return [];
    },

    isPageChangeAllowed: function(pageElement, configuarion, options) {
      return true;
    },

    prepareNextPageTimeout: 200
  };

  return {
    repository: [],

    register: function(name, pageType) {
      var constructor = function() {};

      _.extend(constructor.prototype, base, Backbone.Events, pageType);
      this.repository[name] = constructor;
    },

    get: function(name) {
      if (!this.repository[name]) {
        throw 'Unknown page type "' + name + '"';
      }

      return new this.repository[name]();
    }
  };
}());
