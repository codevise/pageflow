pageflow.app.addInitializer(function(/* args */) {
  var context = this;
  var args = arguments;

  _.each(pageflow.editor.initializers, function(fn) {
    fn.call(context, args);
  });
});
