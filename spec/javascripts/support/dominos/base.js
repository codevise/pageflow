support.dom = {};

support.dom.Base = pageflow.Object.extend({
  initialize: function($el) {
    this.$el = $el;
  }
});

support.dom.Base.classMethods = function(Constructor) {
  return {
    find: function(view) {
      var selector = Constructor.prototype.selector;
      var element = view.$el.find(selector);

      if (element.length > 1) {
        throw new Error('Selector "' + selector + '" matches multiple elements in view. Expected only one');
      }

      if (element.length === 0) {
        throw new Error('Selector "' + selector + '" did not match any elements in view.');
      }

      return new Constructor(element);
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

support.dom.Base.extend = function(/* arguments */) {
  var result = pageflow.Object.extend.apply(this, arguments);
  _.extend(result, support.dom.Base.classMethods(result));
  return result;
};
