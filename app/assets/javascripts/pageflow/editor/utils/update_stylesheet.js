pageflow.updateStylesheet = function(name) {
  var link = $('head link[data-name=' + name + ']');

  var newHref = pageflow.editor.themes.findWhere({
    name: pageflow.entry.configuration.get('theme_name')
  }).get('stylesheet_path');

  if (link.attr('href') !== newHref) {
    link.attr('href', newHref);
  }
};
