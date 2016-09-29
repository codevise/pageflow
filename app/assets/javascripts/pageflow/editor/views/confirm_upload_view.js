pageflow.ConfirmUploadView = Backbone.Marionette.Layout.extend({
  template: 'templates/confirm_upload',
  className: 'confirm_upload editor dialog',

  mixins: [pageflow.dialogView],

  regions: {
    selectedFileRegion: '.selected_file_region'
  },

  ui: {
    filesPanel: '.files_panel',
  },

  events: {
    'click .upload': function() {
      this.options.fileUploader.submit();
      this.close();
    }
  },

  initialize: function() {
    this.selection = new Backbone.Model();
    this.listenTo(this.selection, 'change', this.update);
  },

  onRender: function() {
    this.options.fileTypes.each(function(fileType) {
      this.ui.filesPanel.append(this.subview(new pageflow.UploadableFilesView({
        collection: this.options.files[fileType.collectionName],
        fileType: fileType,
        selection: this.selection
      })).el);
    }, this);

    this.update();
  },

  onClose: function() {
    this.options.fileUploader.abort();
  },

  update: function() {
    var file = this.selection.get('file');

    if (file) {
      this.selectedFileRegion.show(new pageflow.EditFileView({
        model: file
      }));
    }
    else {
      this.selectedFileRegion.close();
    }
  }
});

pageflow.ConfirmUploadView.watch = function(fileUploader, fileTypes, files) {
  fileUploader.on('new:batch', function() {
    pageflow.ConfirmUploadView.open({
      fileUploader: fileUploader,
      fileTypes: fileTypes,
      files: files
    });
  });
};

pageflow.ConfirmUploadView.open = function(options) {
  pageflow.app.dialogRegion.show(new pageflow.ConfirmUploadView(options));
};