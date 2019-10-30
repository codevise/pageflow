pageflow.FileImport = Backbone.Model.extend({
  modelName: 'file_import',
  action: 'search',
  url: function () {
    var title = pageflow.entry.get('entry_title');
    return '/editor/entries/'+title+'/file_import/'+this.importer.key+'/'+this.action
  },
  initialize: function(importer_key) {
    this.importer = pageflow.editor.fileImporters.find(importer_key)
  },
  createFileImportDialogView: function () {
    return this.importer.createFileImportDialogView(this);
  },
  select: function(options) {
    
  },
  search: function (query) {
    this.action = 'search';
    return this.fetch({
      data: {
        query: query
      }
    });
  },
  get_files_meta_data: function (options) {
    this.action = 'files_meta_data';
  },
  download_file: function (options) {
    this.action = 'download_file';
  }
});

