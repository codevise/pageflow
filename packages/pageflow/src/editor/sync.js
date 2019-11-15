import Backbone from 'backbone';

(function() {
  var sync = Backbone.sync;

  Backbone.sync = function(method, model, options) {
    if (model.paramRoot && !options.attrs) {
      options.attrs = options.queryParams || {};
      options.attrs[model.paramRoot] = model.toJSON(options);
    }

    return sync(method, model, options);
  };
}());