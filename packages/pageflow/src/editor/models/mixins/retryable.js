import _ from 'underscore';

export const retryable = {
  retry: function(options) {
    options = options ? _.clone(options) : {};
    if (options.parse === void 0) options.parse = true;
    var model = this;
    options.success = function(resp) {
      if (!model.set(model.parse(resp, options), options)) return false;
      model.trigger('sync', model, resp, options);
    };
    options.error = function(resp) {
      model.trigger('error', model, resp, options);
    };
    options.url = this.url() + '/retry';
    return this.sync('create', this, options);
  }
};
