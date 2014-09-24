pageflow.FileType = pageflow.Object.extend({
  initialize: function(options) {
    this.model = options.model;

    this.typeName = options.typeName;
    this.collectionName = options.collectionName;

    this.metaDataAttributes = options.metaDataAttributes || [];

    if (typeof options.matchUpload === 'function') {
      this.matchUpload = options.matchUpload;
    }
    else if (options.matchUpload instanceof RegExp)  {
      this.matchUpload = function(upload) {
        return upload.type.match(options.matchUpload);
      };
    }
    else {
      throw 'matchUpload option of FileType "' + this.collectionName + '" must either be a function or a RegExp.';
    }
  }
});