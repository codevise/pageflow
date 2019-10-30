pageflow.FilesImporterView = Backbone.Marionette.ItemView.extend({
  template: 'templates/files_importer',
  className: 'files_importer editor dialog',

  mixins: [pageflow.dialogView],

  ui: {
    contentPanel: '.content_panel',
    importButton: '.import',
    closeButton: '.close'
  },

  events: {
    'click .ok': function() {
      if (this.options.callback) {
        this.options.callback(this.selection.get('entry'),
                              this.selection.get('file'));
      }
      this.close();
    }
  },

  initialize: function(options) {
    this.model = new Backbone.Model({
      importer_key: options.importer_key,
      importer: new pageflow.FileImport(options.importer_key)
    });
  },

  onRender: function() {
    this.ui.contentPanel.append(this.model.get('importer').createFileImportDialogView().render().el);
    this.ui.importButton.prop('disabled', true);
  }
});

pageflow.FilesImporterView.open = function(options) {
  pageflow.app.dialogRegion.show(new pageflow.FilesImporterView(options));
};
