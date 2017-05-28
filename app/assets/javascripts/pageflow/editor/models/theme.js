pageflow.Theme = Backbone.Model.extend({
  initialize: function(attributes, options) {
    this.options = options || {};
  },

  title: function() {
    return I18n.t('pageflow.' + this.get('name') + '_theme.name');
  },

  thumbnailUrl: function() {
    return this.options.thumbnailUrl || this.get('preview_image_url');
  }
});
