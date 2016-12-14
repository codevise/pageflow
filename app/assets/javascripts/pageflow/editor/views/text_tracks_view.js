pageflow.TextTracksView = Backbone.Marionette.Layout.extend({
  template: 'templates/text_tracks',
  className: 'text_tracks',

  regions: {
    selectedFileRegion: '.selected_file_region'
  },

  ui: {
    filesPanel: '.files_panel',
    selectedFileHeader: '.selected_file_header'
  },

  events: {
    'click a.upload': 'upload'
  },

  initialize: function(options) {
    this.options = options || {};
    this.selection = new Backbone.Model();
    this.listenTo(this.selection, 'change', this.update);
  },

  onRender: function() {
    this.nestedFilesView = new pageflow.NestedFilesView({
      collection: this.model.nestedFiles(this.options.supersetCollection),
      fileType: pageflow.editor.fileTypes.findByCollectionName('text_track_files'),
      selection: this.selection,
      model: this.model,
      tableBlankSlateText:
      I18n.t('pageflow.editor.nested_files.text_track_files.no_files_blank_slate')
    });

    this.ui.filesPanel.append(this.subview(this.nestedFilesView).el);

    this.update();

    pageflow.editor.setUploadTargetFile(this.model);
  },

  onClose: function() {
    pageflow.editor.setUploadTargetFile(undefined);
  },

  update: function() {
    var selectedFile = this.selection.get('file');
    if (selectedFile) {
      this.selectedFileRegion.show(new pageflow.EditFileView({
        model: selectedFile,
        attributeTranslationKeyPrefixes: [
          'pageflow.editor.nested_files.text_track_files'
        ]
      }));
      this.ui.selectedFileHeader.toggle(true);
    }
    else {
      this.selectedFileRegion.close();
      this.ui.selectedFileHeader.toggle(false);
    }
  },

  upload: function() {
    pageflow.app.trigger('request-upload');
  }
});
