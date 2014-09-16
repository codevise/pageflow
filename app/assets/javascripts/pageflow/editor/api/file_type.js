pageflow.FileType = pageflow.Object.extend({
  initialize: function(options) {
    this.model = options.model;
    this.typeName = options.typeName;
    this.collectionName = options.collectionName;
    this.metaDataAttributes = options.metaDataAttributes || [];
  }
});