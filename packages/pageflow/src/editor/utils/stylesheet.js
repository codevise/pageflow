import $ from 'jquery';

export const stylesheet = {
  reload: function(name) {
    var link = this.selectLink(name);

    if (!link.data('originalHref')) {
      link.data('originalHref', link.attr('href'));
    }

    link.attr('href', link.data('originalHref') + '&reload=' + new Date().getTime());
  },

  update: function(name, stylesheetPath) {
    var link = this.selectLink(name);

    if (link.attr('href') !== stylesheetPath) {
      link.attr('href', stylesheetPath);
    }
  },

  selectLink: function(name) {
    return $('head link[data-name=' + name + ']');
  }
};
