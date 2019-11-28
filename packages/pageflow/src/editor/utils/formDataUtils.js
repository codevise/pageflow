import $ from 'jquery';
import _ from 'underscore';

export const formDataUtils = {
  fromModel: function(model) {
    var object = {};
    object[model.modelName] = model.toJSON();

    return this.fromObject(object);
  },

  fromObject: function(object) {
    var queryString = $.param(object).replace(/\+/g, '%20');

    return _(queryString.split('&')).reduce(function(result, param) {
      var pair = param.split('=');
      result[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);

      return result;
    }, {});
  }
};
