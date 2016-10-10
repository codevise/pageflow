support.factories = {
  entry: function entry(attributes, options) {
    return new pageflow.Entry(attributes, _.extend({
      storylines: new Backbone.Collection(),
      chapters: new Backbone.Collection(),
      files: {}
    }, options));
  },

  fileType: function(options) {
    var fileTypes = new pageflow.FileTypes();

    fileTypes.register('image_files', _.extend({
      model: pageflow.ImageFile,
      matchUpload: /^image/
    }, options || {}));

    fileTypes.setup([{
      collectionName: 'image_files',
      typeName: 'Pageflow::ImageFile'
    }]);

    return fileTypes.first();
  },

  filesCollection: function(options) {
    return pageflow.FilesCollection.createForFileType(options.fileType,
                                                      [{}, {}]);
  },

  file: function(attributes, options) {
    return new pageflow.ImageFile(attributes, options);
  }
};