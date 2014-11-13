pageflow.Theming = Backbone.Model.extend({
  modelName: 'theming',
  i18nKey: 'pageflow/theming',
  collectionName: 'themings',

  mixins: [pageflow.widgetSubject],

  hasHomeButton: function() {
    return this.get('home_button');
  }
});
