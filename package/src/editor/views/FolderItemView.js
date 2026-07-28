import I18n from 'i18n-js';
import Marionette from 'backbone.marionette';

import {listHighlighting} from './mixins/listHighlighting';

import template from '../templates/folderItem.jst';

export const FolderItemView = Marionette.ItemView.extend({
  template,
  tagName: 'li',
  className: 'file_folders-item',

  mixins: [listHighlighting],

  ui: {
    name: '.file_folders-name',
    fileCount: '.file_folders-file_count',
    input: '.file_folders-input'
  },

  events: {
    'click .file_folders-button': 'select',

    'keydown .file_folders-input': 'handleInputKeyDown',
    'blur .file_folders-input': 'commit'
  },

  modelEvents: {
    // Rerender to replace the name input with the row of the created
    // folder.
    'change:id': 'render',
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

  serializeData: function() {
    return {naming: this.model.isNew()};
  },

  onRender: function() {
    this.$el.toggleClass('selectable', !!this.options.selectionHandler);

    this.$el.toggleClass('naming', this.model.isNew());
    this.update();
    this.updateFileCount();

    if (this.model.isNew()) {
      setTimeout(() => this.ui.input.focus(), 0);
    }
  },

  // Navigating into the folder is the only action of the row, so it is
  // also what selecting the highlighted row does.
  select: function() {
    this.options.onSelect(this.model);
  },

  update: function() {
    this.ui.name.text(this.model.get('name'));
  },

  // Removing the folder from the collection notifies the view before it
  // has stopped listening.
  updateFileCount: function() {
    if (this.isClosed) {
      return;
    }

    this.ui.fileCount.text(
      I18n.t('pageflow.editor.views.folder_item_view.file_count', {count: this.fileCount()})
    );
  },

  // Files in subfolders count towards the folder as well, matching the
  // recursive notion of an empty folder.
  fileCount: function() {
    var permaIds = this.options.fileFolders.descendantPermaIdsOf(this.model);

    return this.options.files.filter(function(file) {
      return permaIds.indexOf(file.get('folder_perma_id')) >= 0;
    }).length;
  },

  handleInputKeyDown: function(event) {
    if (event.key === 'Enter') {
      this.commit();
    }
    else if (event.key === 'Escape') {
      this.discard();
    }
  },

  commit: function() {
    var name = this.ui.input.val().trim();

    if (!name) {
      return this.discard();
    }

    if (this.model.isNew()) {
      this.model.set('name', name);
      this.model.save();
    }
  },

  // Blurring after the row has been discarded already would otherwise
  // try to remove the model a second time.
  discard: function() {
    if (this.model.isNew()) {
      this.model.collection?.remove(this.model);
    }
  }
});
