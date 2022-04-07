import I18n from 'i18n-js';
import Marionette from 'backbone.marionette';
import _ from 'underscore';

import {PresenceTableCellView, TableView, TextTableCellView} from 'pageflow/ui';

export const UploadableFilesView = Marionette.View.extend({
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

  render: function() {
    this.appendSubview(new TableView({
      collection: this.uploadableFiles,
      attributeTranslationKeyPrefixes: [
        'pageflow.editor.files.attributes.' + this.options.fileType.collectionName,
        'pageflow.editor.files.common_attributes'
      ],
      columns: this.commonColumns({
        fileTypeDisplayName: I18n.t('pageflow.editor.files.tabs.' +
                                       this.options.fileType.collectionName)
      }).concat(this.fileTypeColumns()),
      selection: this.options.selection,
      selectionAttribute: 'file'
    }));

    this.listenTo(this.uploadableFiles, 'add remove', this.update);
    this.update();

    return this;
  },

  update: function() {
    this.$el.toggleClass('is_empty', this.uploadableFiles.length === 0);
  },

  commonColumns: function(options) {
    return [
      {
        name: 'file_name',
        headerText: options.fileTypeDisplayName,
        cellView: TextTableCellView
      },
      {name: 'rights', cellView: PresenceTableCellView}
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
