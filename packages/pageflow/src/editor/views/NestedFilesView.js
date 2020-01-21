import Marionette from 'backbone.marionette';
import _ from 'underscore';

import {DeleteRowTableCellView, TableView} from 'pageflow/ui';

import template from '../templates/nestedFiles.jst';

export const NestedFilesView = Marionette.ItemView.extend({
  template,

  className: 'nested_files',

  ui: {
    header: 'h2'
  },

  initialize: function() {
    if (!this.options.selection.has('file')) {
      this.options.selection.set('file', this.collection.first());
      this.options.selection.set('nextFile', this.collection.at(1));
    }

    this.listenTo(this.collection, 'add', this.selectNewFile);
    this.listenTo(this.collection, 'remove', this.selectNextFileIfSelectionDeleted);
    this.listenTo(this.options.selection, 'change', this.setNextFile);
    this.listenTo(this.collection, 'add', this.update);
    this.listenTo(this.collection, 'remove', this.update);
    this.listenTo(this.collection, 'request', this.update);
    this.listenTo(this.collection, 'sync', this.update);
  },

  onRender: function() {
    this.ui.header.text(
      this.collection.parentModel.get('file_name')
    );

    this.appendSubview(new TableView({
      collection: this.collection,
      attributeTranslationKeyPrefixes: [
        'pageflow.editor.nested_files.' + this.options.fileType.collectionName
      ],
      columns: this.columns(this.options.fileType),
      selection: this.options.selection,
      selectionAttribute: 'file',
      blankSlateText: this.options.tableBlankSlateText
    }));

    this.update();
  },

  update: function() {
    this.$el.toggleClass('is_empty', this.collection.length === 0);
  },

  columns: function(fileType) {
    var nestedFilesColumns = _(fileType.nestedFileTableColumns).map(function(column) {
      return _.extend({}, column, {
        configurationAttribute: true
      });
    });

    nestedFilesColumns.push({
      name: 'delete',
      cellView: DeleteRowTableCellView,
      cellViewOptions: {
        toggleDeleteButton: 'isUploading',
        invertToggleDeleteButton: true
      }
    });

    return nestedFilesColumns;
  },

  selectNewFile: function(file) {
    this.options.selection.set('file', file);
    this.setNextFile();
  },

  selectNextFileIfSelectionDeleted: function() {
    var fileIndex = this.collection.indexOf(this.options.selection.get('file'));
    if (fileIndex === -1)
    {
      var nextFile = this.options.selection.get('nextFile');
      this.options.selection.set('file', nextFile);
    }
  },

  setNextFile: _.debounce(function() {
    var fileIndex = this.collection.indexOf(this.options.selection.get('file'));

    if (typeof(this.collection.at(fileIndex + 1)) !== 'undefined') {
      this.options.selection.set('nextFile', this.collection.at(fileIndex + 1));
    }
    else if (typeof(this.collection.at(fileIndex - 1)) !== 'undefined') {
      this.options.selection.set('nextFile', this.collection.at(fileIndex - 1));
    }
    else {
      this.options.selection.set('nextFile', undefined);
    }
  }, 200)
});
