pageflow.ConfirmFileImportUploadView = Backbone.Marionette.Layout.extend({
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
      this.onImport();
    },
    'click .close': function () {
      this.closeMe();
    }
  },
  getSelectedFiles: function () {
    var files = [];
    for (var key in pageflow.files) {
      if (pageflow.files.hasOwnProperty(key)) {
        var collection = pageflow.files[key];
        if (collection.length>0) {
          files = files.concat(collection.toJSON());
        }
      }
    }
    return files;
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
  onImport: function () {
    var cName = this.options.fileImportModel.get('metaData').collection;
    this.options.fileImportModel.get('importer').startImportJob(cName);
    this.close();
  },
  closeMe: function() {
    var cName = this.options.fileImportModel.get('metaData').collection;
    this.options.fileImportModel.get('importer').cancelImport(cName);
    this.close();
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


pageflow.ConfirmFileImportUploadView.open = function(options) {
  pageflow.app.dialogRegion.show(new pageflow.ConfirmFileImportUploadView(options));
};