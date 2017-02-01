pageflow.WidgetItemView = Backbone.Marionette.Layout.extend({
  template: 'templates/widget_item',
  tagName: 'li',
  className: 'widget_item',

  regions: {
    widgetTypeContainer: '.widget_type'
  },

  ui: {
    role: 'h2'
  },

  onRender: function() {
    var widgetTypes = this.options.widgetTypes[this.model.role()] || [];

    this.widgetTypeContainer.show(new pageflow.SelectInputView({
      model: this.model,
      propertyName: 'type_name',
      label: I18n.t('pageflow.widgets.roles.' + this.model.role()),
      collection: widgetTypes,
      valueProperty: 'name',
      translationKeyProperty: 'translationKey',
      includeBlank: true
    }));

    this.$el.toggle(widgetTypes.length > 1);
  }
});