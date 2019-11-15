// A partial implementation of a collection that can store records of
// different model types.  Backbone.Collection tries to merge records
// if they have the same id.
pageflow.MultiCollection = function() {
  this.records = {};
  this.length = 0;
};

_.extend(pageflow.MultiCollection.prototype, {
  add: function(record) {
    if (!this.records[record.cid]) {
      this.records[record.cid] = record;
      this.length = _.keys(this.records).length;

      this.trigger('add', record);
    }
  },

  remove: function(record) {
    if (this.records[record.cid]) {
      delete this.records[record.cid];
      this.length = _.keys(this.records).length;

      this.trigger('remove', record);
    }
  },

  isEmpty: function() {
    return this.length === 0;
  }
});

_.extend(pageflow.MultiCollection.prototype, Backbone.Events);

pageflow.MultiCollection.extend = Backbone.Collection.extend;
