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
    matchUpload: /vtt$/,
    skipUploadConfirmation: true,
    configurationEditorInputs: [
      {
        name: 'label',
        inputView: pageflow.TextInputView
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
        inputView: pageflow.TextInputView
      }
    ],
    nestedFileTableColumns: [
      {
        name: 'label',
        cellView: pageflow.TextTableCellView,
        default: function(options) {
          if (!!options.model.get(options.contentBinding)) {
            return I18n.t('pageflow.languages.' + options.model.get(options.contentBinding),
                          {defaultValue: I18n.t('pageflow.languages.unknown')});
          }
          else {
            return I18n.t('pageflow.editor.nested_files.text_track_files.label.missing');
          }
        },
        contentBinding: 'srclang'
      },
      {
        name: 'srclang',
        cellView: pageflow.PresenceTableCellView
      },
      {
        name: 'kind',
        cellView: pageflow.IconTableCellView,
        cellViewOptions: {
          icons: pageflow.config.availableTextTrackKinds
        }
      },
    ]
  });

  pageflow.editor.fileTypes.setup(options.config.fileTypes);
});
