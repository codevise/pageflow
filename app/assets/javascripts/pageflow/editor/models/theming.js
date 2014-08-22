pageflow.Theming = Backbone.Model.extend({
  modelName: 'theming',
  i18nKey: 'pageflow/theming',

  hasHomeButton: function() {
    return this.get('home_button');
  }
});
