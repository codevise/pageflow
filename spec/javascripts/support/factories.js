support.factories = {
  entry: function entry(attributes, options) {
    var fileTypes = new pageflow.FileTypes();
    fileTypes.setup([]);

    return new pageflow.Entry(attributes, _.extend({
      storylines: new Backbone.Collection(),
      chapters: new Backbone.Collection(),
      files: {},
      fileTypes: fileTypes
    }, options));
  },

  fileTypesWithImageFileType: function(options) {
    var fileTypes = new pageflow.FileTypes();

    fileTypes.register('image_files', _.extend({
      model: pageflow.ImageFile,
      matchUpload: /^image/
    }, options));

    fileTypes.setup([{
      collectionName: 'image_files',
      typeName: 'Pageflow::ImageFile'
    }]);

    return fileTypes;
  },

  imageFileType: function(options) {
    return support.factories.fileTypesWithImageFileType(options).first();
  },

  fileType: function(options) {
    return support.factories.imageFileType(options);
  },

  filesCollection: function(options) {
    return pageflow.FilesCollection.createForFileType(options.fileType,
                                                      [{}, {}]);
  },

  nestedFilesCollection: function(options) {
    return new pageflow.SubsetCollection({
      parentModel: support.factories.file({file_name: options.parentFileName}),
      filter: function() {
        return true;
      },
      parent: support.factories.filesCollection(
        {fileType: options.fileType}
      )
    });
  },

  file: function(attributes, options) {
    return new pageflow.ImageFile(attributes, options);
  }
};