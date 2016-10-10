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
    }
  };
};

support.dom.Base.extend = function(/* arguments */) {
  var result = pageflow.Object.extend.apply(this, arguments);
  _.extend(result, support.dom.Base.classMethods(result));
  return result;
};
