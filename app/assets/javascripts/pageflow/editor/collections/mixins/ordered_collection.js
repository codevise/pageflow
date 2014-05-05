pageflow.orderedCollection = {
  saveOrder: function() {
    var parentModel = this.parentModel;

    Backbone.sync('patch', parentModel, {
      url: this.url() + '/order',
      attrs: {ids: this.pluck('id')},

      success: function(response) {
        parentModel.trigger('sync', parentModel, response, {});
        parentModel.trigger('sync:order', parentModel, response, {});
      }
    });
  }
};