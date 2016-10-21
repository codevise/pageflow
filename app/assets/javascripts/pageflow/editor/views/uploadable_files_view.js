pageflow.UploadableFilesView = Backbone.Marionette.ItemView.extend({
  template: 'templates/uploadable_files',

  className: 'uploadable_files',

  ui: {
    header: 'h2'
  },

  initialize: function() {
    this.uploadableFiles = this.collection.uploadable();

    if (!this.options.selection.has('file')) {
      this.options.selection.set('file', this.uploadableFiles.first());
    }
  },

  onRender: function() {
    this.ui.header.text(
      I18n.t('pageflow.editor.files.tabs.' + this.options.fileType.collectionName)
    );

    this.appendSubview(new pageflow.TableView({
      collection: this.uploadableFiles,
      attributeTranslationKeyPrefixes: [
        'pageflow.editor.files.attributes.' + this.options.fileType.collectionName,
        'pageflow.editor.files.common_attributes'
      ],
      columns: this.commonColumns().concat(this.fileTypeColumns()),
      selection: this.options.selection,
      selectionAttribute: 'file'
    }));

    this.listenTo(this.uploadableFiles, 'add remove', this.update);
    this.update();
  },

  update: function() {
    this.$el.toggleClass('is_empty', this.uploadableFiles.length === 0);
  },

  commonColumns: function() {
    return [
      {name: 'file_name', cellView: pageflow.TextTableCellView},
      {name: 'rights', cellView: pageflow.PresenceTableCellView}
    ];
  },

  fileTypeColumns: function() {
    return _(this.options.fileType.confirmUploadTableColumns).map(function(column) {
      return _.extend({}, column, {
        configurationAttribute: true
      });
    });
  }
});