pageflow.Theming = Backbone.Model.extend({
  modelName: 'theming',
  i18nKey: 'pageflow/theming',
  collectionName: 'themings',

  hasHomeButton: function() {
    return this.get('home_button');
  },

  hasOverviewButton: function() {
    return this.get('overview_button');
  },

  supportsEmphasizedPages: function() {
    return this.get('emphasized_pages');
  },

  supportsScrollIndicatorModes: function() {
    return this.get('scroll_indicator_modes');
  }
});
