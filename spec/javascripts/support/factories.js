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
    options = options || {};
    var fileTypes = new pageflow.FileTypes();
    var fileTypesSetupArray = [
      {
        collectionName: 'image_files',
        typeName: 'Pageflow::ImageFile'
      }
    ];

    fileTypes.register('image_files', _.extend({
      model: pageflow.ImageFile,
      matchUpload: /^image/,
      topLevelType: true
    }, options));

    if (options.addVideoAndNestedFileTypes) {
      fileTypes.register('video_files', _.extend({
        model: pageflow.VideoFile,
        matchUpload: /^video/,
        topLevelType: true
      }, options));

      fileTypes.register('text_track_files', _.extend({
        model: pageflow.TextTrackFile,
        matchUpload: /vtt$/
      }, options));

      fileTypes.register('dont_nest_these_files', _.extend({
        model: pageflow.TextTrackFile,
        matchUpload: /dont$/
      }, options));

      fileTypesSetupArray = fileTypesSetupArray.concat([
        {
          collectionName: 'video_files',
          typeName: 'Pageflow::VideoFile',
          nestedFileTypes: [{collectionName: 'text_track_files'}]
        },
        {
          collectionName: 'text_track_files',
          typeName: 'Pageflow::TextTrackFile'
        },
        {
          collectionName: 'dont_nest_these_files',
          typeName: 'Pageflow::TextTrackFile'
        }
      ]);
    }
    fileTypes.setup(fileTypesSetupArray);

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
