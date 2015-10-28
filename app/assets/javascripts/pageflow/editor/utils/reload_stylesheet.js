pageflow.reloadStylesheet = function(name) {
  var link = $('head link[data-name=' + name + ']');

  if (!link.data('originalHref')) {
    link.data('originalHref', link.attr('href'));
  }

  link.attr('href', link.data('originalHref') + '&reload=' + new Date().getTime());
};