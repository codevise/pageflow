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

  modelEvents: {
    'change:type_name': 'update'
  },

  events: {
    'click .settings': function() {
      pageflow.editor.navigate('/widgets/' + this.model.role(), {trigger: true});
      return false;
    },
  },

  onRender: function() {
    var widgetTypes = this.options.widgetTypes.findAllByRole(this.model.role()) || [];
    var isOptional = this.options.widgetTypes.isOptional(this.model.role());

    this.widgetTypeContainer.show(new pageflow.SelectInputView({
      model: this.model,
      propertyName: 'type_name',
      label: I18n.t('pageflow.widgets.roles.' + this.model.role()),
      collection: widgetTypes,
      valueProperty: 'name',
      translationKeyProperty: 'translationKey',
      includeBlank: isOptional || !this.model.get('type_name')
    }));

    this.$el.toggleClass('is_hidden', widgetTypes.length <= 1 &&
                         !this.model.hasConfiguration() &&
                         !isOptional);

    this.update();
  },

  update: function() {
    this.$el.toggleClass('has_settings', this.model.hasConfiguration());
  }
});