pageflow.orderedCollection = {
  saveOrder: function() {
    var parentModel = this.parentModel;
    var collection = this;

    if (collection.isEmpty()) {
      return $.Deferred().resolve().promise();
    }

    return Backbone.sync('patch', parentModel, {
      url: collection.url() + '/order',
      attrs: {ids: collection.pluck('id')},

      success: function(response) {
        parentModel.trigger('sync', parentModel, response, {});
        parentModel.trigger('sync:order', parentModel, response, {});
      },

      error: function(jqXHR,  textStatus, errorThrown) {
        pageflow.editor.failures.add(new pageflow.OrderingFailure(parentModel, collection));
      }
    });
  }
};
