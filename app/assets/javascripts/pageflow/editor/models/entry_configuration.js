pageflow.EntryConfiguration = pageflow.Configuration.extend({
  modelName: 'entry',
  i18nKey: 'pageflow/entry',

  initialize: function() {
    pageflow.Configuration.prototype.initialize.apply(this, arguments);
    this.shareProvidersConfiguration = new Backbone.Model(this.get('share_providers'));
    this.shareProvidersConfiguration.i18nKey = 'pageflow/entry.share_providers';
    this.listenTo(this.shareProvidersConfiguration, 'change', function() {
      this.trigger('change');
    });
  },

  toJSON: function() {
    return _.extend(pageflow.Configuration.prototype.toJSON.call(this),
      {share_providers: this.shareProvidersConfiguration.toJSON()});
  }
});
