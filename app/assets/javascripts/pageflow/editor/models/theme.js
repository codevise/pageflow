pageflow.Theme = Backbone.Model.extend({
  title: function() {
    return I18n.t('pageflow.' + this.get('name') + '_theme.name');
  },

  thumbnailUrl: function() {
    return this.get('preview_image_url');
  }
});
