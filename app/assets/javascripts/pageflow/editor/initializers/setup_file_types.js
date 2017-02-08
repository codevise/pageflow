pageflow.app.addInitializer(function(options) {
  var textTracksMetaDataAttribute = {
    name: 'text_tracks',
    valueView: pageflow.TextTracksFileMetaDataItemValueView,
    valueViewOptions: {
      settingsDialogTabLink: 'text_tracks',
    }
  };

  var textTracksSettingsDialogTab = {
    name: 'text_tracks',
    view: pageflow.TextTracksView,
    viewOptions: {
      supersetCollection: function() {
        return pageflow.textTrackFiles;
      }
    }
  };

  var altMetaDataAttribute = {
    name: 'alt',
    valueView: pageflow.TextFileMetaDataItemValueView,
    valueViewOptions: {
      fromConfiguration: true,
      settingsDialogTabLink: 'general'
    }
  };

  pageflow.editor.fileTypes.register('image_files', {
    model: pageflow.ImageFile,
    metaDataAttributes: [
      'dimensions',
      altMetaDataAttribute
    ],
    matchUpload: /^image/,
    configurationEditorInputs: [
      {
        name: 'alt',
        inputView: pageflow.TextInputView
      }
    ]
  });

  pageflow.editor.fileTypes.register('video_files', {
    model: pageflow.VideoFile,
    metaDataAttributes: [
      'format',
      'dimensions',
      'duration',
      textTracksMetaDataAttribute,
      altMetaDataAttribute
    ],
    matchUpload: /^video/,
    configurationEditorInputs: [
      {
        name: 'alt',
        inputView: pageflow.TextInputView
      }
    ],
    settingsDialogTabs: [
      textTracksSettingsDialogTab
    ]
  });

  pageflow.editor.fileTypes.register('audio_files', {
    model: pageflow.AudioFile,
    metaDataAttributes: [
      'format',
      'duration',
      textTracksMetaDataAttribute,
      altMetaDataAttribute
    ],
    matchUpload: /^audio/,
    configurationEditorInputs: [
      {
        name: 'alt',
        inputView: pageflow.TextInputView
      }
    ],
    settingsDialogTabs: [
      textTracksSettingsDialogTab
    ]
  });

  pageflow.editor.fileTypes.register('text_track_files', {
    model: pageflow.TextTrackFile,
    matchUpload: function(upload) {
      return upload.type.match(/\/vtt$/) ||
        upload.name.match(/\.srt$/);
    },
    skipUploadConfirmation: true,
    configurationEditorInputs: [
      {
        name: 'label',
        inputView: pageflow.TextInputView,
        inputViewOptions: {
          placeholder: function(configuration) {
            var textTrackFile = configuration.parent;
            return textTrackFile.inferredLabel();
          },
          placeholderBinding: pageflow.TextTrackFile.displayLabelBinding
        }
      },
      {
        name: 'kind',
        inputView: pageflow.SelectInputView,
        inputViewOptions: {
          values: pageflow.config.availableTextTrackKinds,
          translationKeyPrefix: 'pageflow.config.text_track_kind'
        }
      },
      {
        name: 'srclang',
        inputView: pageflow.TextInputView,
        inputViewOptions: {
          required: true
        }
      }
    ],
    nestedFileTableColumns: [
      {
        name: 'label',
        cellView: pageflow.TextTableCellView,
        value: function(textTrackFile) {
          return textTrackFile.displayLabel();
        },
        contentBinding: pageflow.TextTrackFile.displayLabelBinding
      },
      {
        name: 'srclang',
        cellView: pageflow.TextTableCellView,
        default: I18n.t('pageflow.editor.text_track_files.srclang_missing')
      },
      {
        name: 'kind',
        cellView: pageflow.IconTableCellView,
        cellViewOptions: {
          icons: pageflow.config.availableTextTrackKinds
        }
      },
    ],
    nestedFilesOrder: {
      comparator: function(textTrackFile) {
        return textTrackFile.displayLabel().toLowerCase();
      },
      binding: 'label'
    }
  });

  pageflow.editor.fileTypes.setup(options.config.fileTypes);
});
