pageflow.FailedRecordsCollection = pageflow.MultiCollection.extend({
  watch: function(collection) {
    this.listenTo(collection, 'sync', this.remove);

    this.listenTo(collection, 'error', function(model) {
      if (!model.isNew()) {
        this.add(model);
      }
    });
  },

  retry: function() {
    _.chain(this.records).values().each(function(record) {
      this.remove(record);
      record.save();
    }, this);
  }
});