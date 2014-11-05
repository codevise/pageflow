/*global JST*/

Backbone.Marionette.Renderer.render = function(template, data) {
  if (template.indexOf('templates/') === 0) {
    template = 'pageflow/editor/' + template;
  }
  if (!JST[template]) {
    throw "Template '" + template + "' not found!";
  }
  return JST[template](data);
};