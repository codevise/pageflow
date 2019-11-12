pageflow.FilesImporterView = Backbone.Marionette.ItemView.extend({
  template: 'templates/files_importer',
  className: 'files_importer editor dialog',

  mixins: [pageflow.dialogView],

  ui: {
    contentPanel: '.content_panel',
    spinner: '.lds-spinner',
    importButton: '.import',
    closeButton: '.close'
  },

  events: {
    'click .import': function () {
      this.get_meta_data();
    }
  },

  initialize: function(options) {
    this.model = new Backbone.Model({
      importer_key: options.importer_key,
      importer: new pageflow.FileImport(options.importer_key)
    });

    this.listenTo(this.model.get('importer'), "change", function (event) {
      this.updateImportButton();
      if (!this.isInitialized) {
        this.updateAuthenticationView();
      }
    });
  },
  updateAuthenticationView: function () {
    var importer = this.model.get('importer')
    if (importer.get('isAuthenticated')) {
      this.ui.contentPanel.empty();
      this.ui.contentPanel.append(this.model.get('importer').createFileImportDialogView().render().el);
      this.isInitialized = true
    }
  },
  updateImportButton: function () {
    var importer = this.model.get('importer');
    this.ui.importButton.prop('disabled', importer.get('selectedFiles').length < 1);
  },
  get_meta_data: function () {
    var self = this;
    this.model.get('importer').getFilesMetaData().then(function (metaData) {
      if (metaData) {
        self.model.set('metaData', metaData);
        // add each selected file meta to pageflow.files
        for(var i = 0; i<metaData.files.length; i++){
          var file = metaData.files[i];
          var fileType = pageflow.editor.fileTypes.findByUpload(file);

           var file = new fileType.model({
            state: 'uploadable',
            file_name: file.name,
            content_type: file.type,
            file_size: -1,
            rights: file.rights,
            url: file.url
          }, {
            fileType: fileType
          });

          pageflow.entry.getFileCollection(fileType).add(file);
        }
        pageflow.ConfirmFileImportUploadView.open({
          fileTypes: pageflow.editor.fileTypes,
          fileImportModel: self.model,
          files: pageflow.files
        });
      }
    });
    this.close();
  }
});

pageflow.FilesImporterView.open = function(options) {
  pageflow.app.dialogRegion.show(new pageflow.FilesImporterView(options).render());
};
