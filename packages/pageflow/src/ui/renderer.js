import Marionette from 'backbone.marionette';
import _ from 'underscore';

/*global JST*/

Marionette.Renderer.render = function(template, data) {
  if (_.isFunction(template)) {
    return template(data);
  }
  if (template.indexOf('templates/') === 0) {
    template = 'pageflow/editor/' + template;
  }
  if (!JST[template]) {
    throw "Template '" + template + "' not found!";
  }
  return JST[template](data);
};