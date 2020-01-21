import $ from 'jquery';
import _ from 'underscore';

import {Object} from 'pageflow/ui';

export const Base = Object.extend({
  initialize: function($el) {
    this.$el = $el;
  }
});

Base.classMethods = function(Constructor) {
  return {
    find: function(viewOrParentElement) {
      var selector = Constructor.prototype.selector;
      var parentElement = viewOrParentElement.$el || viewOrParentElement;
      var element = parentElement.find(selector);

      if (element.length > 1) {
        throw new Error('Selector "' + selector + '" matches multiple elements in view. Expected only one');
      }

      if (element.length === 0) {
        throw new Error('Selector "' + selector + '" did not match any elements in view.');
      }

      return new Constructor(element);
    },

    findAll: function(viewOrParentElement) {
      var selector = Constructor.prototype.selector;
      var parentElement = viewOrParentElement.$el || viewOrParentElement;
      var elements = parentElement.find(selector);

      return elements.map(function() {
        return new Constructor($(this));
      }).get();
    },

    findBy: function(predicate, options) {
      var predicateString = options.predicateName ? ' filtered by ' + options.predicateName : '';
      var selector = Constructor.prototype.selector;
      var selectorString = 'Selector "' + selector + '"' + predicateString;
      var elements = options.inView.$el.find(selector);
      var element = elements.filter(function() {
        return predicate($(this));
      });

      if (element.length > 1) {
        throw new Error(selectorString + ' matches multiple elements in view. Expected only one');
      }

      if (element.length === 0) {
        throw new Error(selectorString + ' did not match any elements in view.');
      }

      return new Constructor(element);
    },

    render: function(view, options) {
      view.render();

      if (options && options.appendTo) {
        options.appendTo.append(view.$el);
      }

      return new Constructor(view.$el);
    }
  };
};

Base.extend = function(/* arguments */) {
  var result = Object.extend.apply(this, arguments);
  _.extend(result, Base.classMethods(result));
  return result;
};
