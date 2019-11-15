/**
 * Display view for a link to a URL, to be used like an input view.
 *
 * @param {string} [options.propertyName]
 *   Target URL for link
 *
 * @see {@link module:pageflow/ui.pageflow.inputView pageflow.inputView} for further options
 * @class
 * @memberof module:pageflow/ui
 */

pageflow.UrlDisplayView = Backbone.Marionette.ItemView.extend({
  mixins: [pageflow.inputView],

  template: 'pageflow/ui/templates/inputs/url_display',

  ui: {
    link: 'a'
  },

  modelEvents: {
    'change': 'update'
  },

  events: {
    'click a': function(event) {
      // Ensure default is not prevented by parent event listener.
      event.stopPropagation();
    }
  },

  onRender: function() {
    this.update();
  },

  update: function() {
    var url = this.model.get('original_url');

    this.$el.toggle(this.model.isUploaded() && !_.isEmpty(url));
    this.ui.link.attr('href', url);
  }
});
