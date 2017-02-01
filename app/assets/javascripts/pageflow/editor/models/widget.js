pageflow.Widget = Backbone.Model.extend({
  paramRoot: 'widget',
  i18nKey: 'pageflow/widget',

  initialize: function() {
    this.configuration = new pageflow.WidgetConfiguration(
      this.get('configuration') || {}
    );

    this.listenTo(this.configuration, 'change', function() {
      this.trigger('change:configuration', this);
    });
  },

  role: function() {
    return this.id;
  },

  urlRoot: function() {
    return this.collection.url();
  },

  toJSON: function() {
    return {
      role: this.role(),
      type_name: this.get('type_name'),
      configuration: this.configuration.toJSON()
    };
  },
});