pageflow.EditWidgetsView = Backbone.Marionette.Layout.extend({
  template: 'templates/edit_widgets',

  ui: {
    widgets: '.widgets'
  },

  onRender: function() {
    this.subview(new pageflow.CollectionView({
      el: this.ui.widgets,
      collection: this.model.widgets,
      itemViewConstructor: pageflow.WidgetItemView,
      itemViewOptions: {
        widgetTypes: this.options.widgetTypes
      }
    }).render());
  }
});