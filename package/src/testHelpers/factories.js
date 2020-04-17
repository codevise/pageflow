import Backbone from 'backbone';
import _ from 'underscore';

import {
  EditorApi,
  Entry,
  FilesCollection,
  ImageFile,
  SubsetCollection,
  TextTrackFile,
  Theme,
  VideoFile,
  WidgetTypes,
  FileTypes
} from 'pageflow/editor';

/**
 * Build editor Backbone models for tests.
 */
export const factories = {
  /**
   * Build an entry model.
   *
   * @param {Function} model - Entry type specific entry model
   * @param {Object} [attributes] - Model attributes
   * @param {Object} [options]
   * @param {Object} [options.entryTypeSeed] - Seed data passed to `Entry#setupFromEntryTypeSeed`.
   * @param {FileTypes} [options.fileTypes] - Use {@link #factoriesfiletypes factories.fileTypes} to construct this object.
   * @param {Object} [options.filesAttributes] - An object mapping (underscored) file collection names to arrays of file attributes.
   * @returns {Entry} - An entry Backbone model.
   *
   * @example
   *
   * import {factories} from 'pageflow/testHelpers';
   * import {PagedEntry} from 'editor/models/PagedEntry';
   *
   * const entry = factories.entry(PagedEntry, {slug: 'some-entry'}, {
   *   entryTypeSeed: {some: 'data'},
   *   fileTypes: factories.fileTypes(f => f.withImageFileType()),
   *   filesAttributes: {
   *     image_files: [{id: 100, perma_id: 1, basename: 'image'}]
   *   }
   * });
   */
  entry: function entry(model, attributes, options = {}) {
    if (typeof model !== 'function') {
      return factories.entry(Entry, model, attributes);
    }

    ensureFileTypes(options);
    ensureFilesCollections(options);

    const entry = new model({
      id: 1,
      ...attributes
    },
    _.extend({
      storylines: new Backbone.Collection(),
      chapters: new Backbone.Collection(),
    }, options));

    if (entry.setupFromEntryTypeSeed && options.entryTypeSeed) {
      entry.setupFromEntryTypeSeed(options.entryTypeSeed);
    }

    return entry;
  },

  theme: function theme(attributes, options) {
    return new Theme(attributes, options);
  },

  /**
   * Construct a file type registry that can be passed to {@link
   * #factoriesentry factories.entry}.
   *
   * The passed function receives a builder object with the following
   * methods that register a corresponding file type:
   *
   * - `withImageFileType([options])`: Registers a file type with collection name `image_files`.
   * - `withVideoFileType([options])`: Registers a file type with collection name `video_files`.
   * - `withTextTrackFileType([options])`: Registers a file type with collection name `text_track_files`.
   *
   * @param {Function} fn - Build function.
   * @returns {FileTypes} - A file Type registry
   */
  fileTypes: function(fn) {
    var fileTypes = new FileTypes();
    var fileTypesSetupArray = [];

    var builder = {
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
    };

    fn.call(builder, builder);

    fileTypes.setup(fileTypesSetupArray);
    return fileTypes;
  },

  /**
  * Shorthand for calling {@link #factoriesfiletypes
  * factories.fileTypes} with a builder function that calls
  * `withImageFileType`.
  *
  * @param {Object} options - File type options passed to withImageFileType,
  * @returns {FileTypes} - A file Type registry.
  */
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
    var api = new EditorApi({
      router: {
        navigate(path, {trigger}) {
          if (trigger) {
            api.trigger('navigate', path);
          }
        }
      }
    });

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

function ensureFileTypes(options) {
  if (!options.fileTypes) {
    options.fileTypes = new FileTypes();
    options.fileTypes.setup([]);
  }
}

function ensureFilesCollections(options) {
  if (!options.files) {
    options.files = FilesCollection.createForFileTypes(options.fileTypes,
                                                       options.filesAttributes);
  }
}
