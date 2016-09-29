pageflow.formDataUtils = {
  fromModel: function(model) {
    var object = {};
    object[model.modelName] = model.toJSON();

    return this.fromObject(object);
  },

  fromObject: function(object) {
    return _(decodeURIComponent($.param(object)).split('&')).reduce(function(result, param) {
      var pair = param.split('=');
      result[pair[0]] = pair[1];

      return result;
    }, {});
  }
};
