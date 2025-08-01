import I18n from 'i18n-js';
import Marionette from 'backbone.marionette';
import _ from 'underscore';

import {PresenceTableCellView, TableView, TextTableCellView} from 'pageflow/ui';
import {editor} from '../base';

export const UploadableFilesView = Marionette.View.extend({
  className: 'uploadable_files',

  initialize: function() {
    this.uploadableFiles = this.collection.uploadable();

    if (!this.options.selection.has('file')) {
      this.options.selection.set('file', this.uploadableFiles.first());
    }
  },

  render: function() {
    var entryTypeName = editor.entryType.name;

    this.appendSubview(new TableView({
      collection: this.uploadableFiles,
      attributeTranslationKeyPrefixes: [
        'pageflow.entry_types.' + entryTypeName + '.editor.files.attributes.' +
          this.options.fileType.collectionName,
        'pageflow.entry_types.' + entryTypeName + '.editor.files.common_attributes',
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
        name: 'display_name',
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
