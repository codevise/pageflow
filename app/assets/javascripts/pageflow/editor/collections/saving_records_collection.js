pageflow.SavingRecordsCollection = pageflow.MultiCollection.extend({
  watch: function(collection) {
    var that = this;

    this.listenTo(collection, 'request', function(model, xhr) {
      that.add(model);

      xhr.always(function() {
        that.remove(model);
      });
    });
  }
});