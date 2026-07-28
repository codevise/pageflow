import I18n from 'i18n-js';
import Marionette from 'backbone.marionette';

import {listHighlighting} from './mixins/listHighlighting';
import {normalizePermaId} from '../utils/permaId';

import template from '../templates/folderItem.jst';

export const FolderItemView = Marionette.ItemView.extend({
  template,
  tagName: 'li',
  className: 'file_folders-item',

  mixins: [listHighlighting],

  ui: {
    name: '.file_folders-name',
    fileCount: '.file_folders-file_count'
  },

  events: {
    'click .file_folders-button': 'select'
  },

  modelEvents: {
    'change:name': 'update'
  },

  initialize: function() {
    this.listenTo(this.options.files,
                  'add remove change:folder_perma_id',
                  this.updateFileCount);

    this.listenTo(this.options.fileFolders,
                  'add remove change:parent_folder_perma_id',
                  this.updateFileCount);
  },

  onRender: function() {
    this.$el.toggleClass('selectable', !!this.options.selectionHandler);

    this.update();
    this.updateFileCount();
  },

  // Navigating into the folder is the only action of the row, so it is
  // also what selecting the highlighted row does.
  select: function() {
    this.options.onSelect(this.model);
  },

  update: function() {
    this.ui.name.text(this.model.get('name'));
  },

  updateFileCount: function() {
    this.ui.fileCount.text(
      I18n.t('pageflow.editor.views.folder_item_view.file_count', {count: this.fileCount()})
    );
  },

  // Files in subfolders count towards the folder as well, matching the
  // recursive notion of an empty folder.
  fileCount: function() {
    var permaIds = this.options.fileFolders.descendantPermaIdsOf(this.model);

    return this.options.files.filter(function(file) {
      return permaIds.indexOf(normalizePermaId(file.get('folder_perma_id'))) >= 0;
    }).length;
  }
});
