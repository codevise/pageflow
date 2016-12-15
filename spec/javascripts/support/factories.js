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

  fileTypes: function(fn) {
    var fileTypes = new pageflow.FileTypes();
    var fileTypesSetupArray = [];

    fn.call({
      withImageFileType: function(options) {
        fileTypes.register('image_files', _.extend({
          model: pageflow.ImageFile,
          matchUpload: /^image/,
          topLevelType: true
        }, options));

        fileTypesSetupArray.push({
          collectionName: 'image_files',
          typeName: 'Pageflow::ImageFile',
          i18nKey: 'pageflow/image_files'
        });

        return this;
      },

      withVideoFileType: function(options) {
        fileTypes.register('video_files', _.extend({
          model: pageflow.VideoFile,
          matchUpload: /^video/,
          topLevelType: true
        }, options));

        fileTypesSetupArray.push({
          collectionName: 'video_files',
          typeName: 'Pageflow::VideoFile',
          i18nKey: 'pageflow/video_files',
          nestedFileTypes: [{collectionName: 'text_track_files'}]
        });

        return this;
      },

      withTextTrackFileType: function(options) {
        fileTypes.register('text_track_files', _.extend({
          model: pageflow.TextTrackFile,
          matchUpload: /vtt$/
        }, options));

        fileTypesSetupArray.push({
          collectionName: 'text_track_files',
          typeName: 'Pageflow::TextTrackFile',
          i18nKey: 'pageflow/text_track_files'
        });

        return this;
      }
    });

    fileTypes.setup(fileTypesSetupArray);
    return fileTypes;
  },

  fileTypesWithImageFileType: function(options) {
    return this.fileTypes(function() {
      this.withImageFileType(options);
    });
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
