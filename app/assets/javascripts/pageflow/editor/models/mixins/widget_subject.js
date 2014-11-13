pageflow.widgetSubject = {
  initialize: function() {
    this.widgets = pageflow.WidgetsCollection.createForSubject(this);

    if (this.autoSaveWidgets) {
      this.listenTo(this.widgets, 'change:type_name', function() {
        this.saveWidgets();
      });
    }
  },

  widgetsUrlRoot: function() {
    return '/editor/subjects/' + this.collectionName + '/' + this.id;
  },

  fetchWidgets: function() {
    this.widgets.fetch();
  },

  saveWidgets: function(options) {
    var model = this;

    return Backbone.sync('patch', model, _.extend(options || {}, {
      url: this.widgetsUrlRoot() + '/widgets/batch',

      attrs: {
        widgets: model.widgets.map(function(widget) {
          return widget.toJSON();
        })
      },

      success: function(response) {
        model.trigger('sync', model, response, {});
      }
    }));
  }
};