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

  onRender: function() {
    this.update();
  },

  update: function() {
    this.ui.link.attr('href', this.model.get(this.options.propertyName));
    this.ui.link.toggle(this.model.isUploaded() && !_.isEmpty(this.model.get('original_url')));
  }
});
