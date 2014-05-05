pageflow.FileUsage = Backbone.Model.extend({
  modelName: 'file_usage',
  paramRoot: 'file_usage',

  urlRoot: function() {
    return this.isNew() ? this.collection.url() : '/editor/file_usages/';
  }
});
