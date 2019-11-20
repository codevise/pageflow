import Backbone from 'backbone';
import _ from 'underscore';

import {EditorApi, Entry, FilesCollection, ImageFile, SubsetCollection, TextTrackFile, Theme, VideoFile} from '$pageflow/editor';
import {WidgetTypes} from '$pageflow/editor/api/WidgetTypes';
import {FileTypes} from '$pageflow/editor/api/FileTypes';

export const factories = {
  entry: function entry(attributes, options) {
    var fileTypes = new FileTypes();
    fileTypes.setup([]);

    return new Entry(attributes, _.extend({
      storylines: new Backbone.Collection(),
      chapters: new Backbone.Collection(),
      files: {},
      fileTypes: fileTypes
    }, options));
  },

  theme: function theme(attributes, options) {
    return new Theme(attributes, options);
  },

  fileTypes: function(fn) {
    var fileTypes = new FileTypes();
    var fileTypesSetupArray = [];

    fn.call({
      withImageFileType: function(options) {
        fileTypes.register('image_files', _.extend({
          model: ImageFile,
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
          model: VideoFile,
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
          model: TextTrackFile,
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
    return factories.fileTypesWithImageFileType(options).first();
  },

  fileType: function(options) {
    return factories.imageFileType(options);
  },

  filesCollection: function(options) {
    return FilesCollection.createForFileType(options.fileType,
                                                      [{}, {}]);
  },

  nestedFilesCollection: function(options) {
    return new SubsetCollection({
      parentModel: factories.file({file_name: options.parentFileName}),
      filter: function() {
        return true;
      },
      parent: factories.filesCollection(
        {fileType: options.fileType}
      )
    });
  },

  videoFileWithTextTrackFiles: function(options) {
    var fileTypes = this.fileTypes(function() {
      this.withVideoFileType(options.videoFileTypeOptions);
      this.withTextTrackFileType(options.textTrackFileTypeOptions);
    });

    var fileAttributes = {
      video_files: [
        _.extend({
          id: 1,
          state: 'encoded'
        }, options.videoFileAttributes)
      ],
      text_track_files: _.map(options.textTrackFilesAttributes, function(attributes) {
        return _.extend({
          parent_file_id: 1,
          parent_file_model_type: 'Pageflow::VideoFile'
        }, attributes);
      })
    };

    var entry = factories.entry({}, {
      files: FilesCollection.createForFileTypes(fileTypes,
                                                         fileAttributes || {}),
      fileTypes: fileTypes
    });

    var videoFiles = entry.getFileCollection(
      fileTypes.findByCollectionName('video_files')
    );

    var textTrackFiles = entry.getFileCollection(
      fileTypes.findByCollectionName('text_track_files')
    );

    return {
      entry: entry,
      videoFile: videoFiles.first(),
      videoFiles: videoFiles,
      textTrackFiles: textTrackFiles
    };

  },

  imageFilesFixture: function(options) {
    var fileTypes = this.fileTypes(function() {
      this.withImageFileType(options.fileTypeOptions);
    });

    var fileAttributes = {
      image_files: [
        _.extend({
          id: 1,
          state: 'processed'
        }, options.imageFileAttributes)
      ]
    };

    var entry = factories.entry({}, {
      files: FilesCollection.createForFileTypes(fileTypes,
                                                         fileAttributes || {}),
      fileTypes: fileTypes
    });

    var imageFiles = entry.getFileCollection(
      fileTypes.findByCollectionName('image_files')
    );

    return {
      entry: entry,
      imageFile: imageFiles.first(),
      imageFiles: imageFiles
    };
  },

  imageFile: function(attributes, options) {
    return new ImageFile(attributes, _.extend({
      fileType: this.imageFileType()
    }, options));
  },

  file: function(attributes, options){
    return this.imageFile(attributes, options);
  },

  widgetTypes: function(attributesList, beforeSetup) {
    var widgetTypes = new WidgetTypes();
    var attributesListsByRole = {};

    _(attributesList).each(function(attributes) {
      attributesListsByRole[attributes.role] = attributesListsByRole[attributes.role] || [];
      attributesListsByRole[attributes.role].push(_.extend({
        translationKey: 'widget_name.' + attributes.name
      }, attributes));
    });

    if (beforeSetup) {
      beforeSetup(widgetTypes);
    }

    widgetTypes.setup(attributesListsByRole);
    return widgetTypes;
  },

  editorApi: function(beforeSetup) {
    var api = new EditorApi();

    if (beforeSetup) {
      beforeSetup(api);
    }

    api.pageTypes.setup(_.map(api.pageTypes.clientSideConfigs, function(config, name) {
      return {
        name: name,
        translation_key_prefix: 'pageflow.' + name,
        translation_key: 'pageflow.' + name + '.name',
        category_translation_key: 'pageflow.' + name + '.category',
        description_translation_key: 'pageflow.' + name + '.description'
      };
    }));

    return api;
  }
};
