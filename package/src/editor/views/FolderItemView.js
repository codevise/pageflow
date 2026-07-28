import Backbone from 'backbone';
import I18n from 'i18n-js';
import Marionette from 'backbone.marionette';

import {DropDownButtonView} from './DropDownButtonView';
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
    actions: '.file_folders-actions',
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
    this.menuItems = this.createMenuItems();

    this.listenTo(this.options.files,
                  'add remove change:folder_perma_id',
                  this.updateFileCount);

    this.listenTo(this.options.fileFolders,
                  'add remove change:parent_folder_perma_id',
                  this.updateFileCount);

    this.listenTo(this.options.files,
                  'add remove change:folder_perma_id',
                  this.updateDestroyItem);

    this.listenTo(this.options.fileFolders,
                  'add remove change:parent_folder_perma_id',
                  this.updateDestroyItem);
  },

  createMenuItems: function() {
    var items = new Backbone.Collection([
      {
        name: 'rename',
        label: I18n.t('pageflow.editor.views.folder_item_view.rename')
      },
      {
        name: 'destroy',
        label: I18n.t('pageflow.editor.views.folder_item_view.destroy'),
        destructive: true
      }
    ]);

    items.findWhere({name: 'rename'}).selected = () => {
      this.renaming = true;
      this.render();
    };

    items.findWhere({name: 'destroy'}).selected = () => this.model.destroy();

    return items;
  },

  // The server refuses to delete a folder which still holds files or
  // subfolders. Files hidden by the file type filter cannot make one
  // look empty, since such a folder is not listed to begin with.
  updateDestroyItem: function() {
    var permaId = this.model.get('perma_id');

    var empty = !this.options.fileFolders.childrenOf(this.model).length &&
                !this.options.files.some(function(file) {
                  return file.get('folder_perma_id') === permaId;
                });

    this.menuItems.findWhere({name: 'destroy'}).set('hidden', !empty);
  },

  serializeData: function() {
    return {
      naming: this.isEditingName(),
      nameLabel: I18n.t(this.renaming ?
                        'pageflow.editor.views.folder_item_view.new_name' :
                        'pageflow.editor.views.folder_item_view.name')
    };
  },

  onRender: function() {
    this.$el.toggleClass('selectable', !!this.options.selectionHandler);

    this.$el.toggleClass('naming', this.isEditingName());
    this.update();
    this.updateFileCount();
    this.updateDestroyItem();
    this.renderActionsDropDown();

    if (this.isEditingName()) {
      this.ui.input.val(this.model.get('name'));
      setTimeout(() => this.ui.input.focus().select(), 0);
    }
  },

  // Navigating into the folder is the only action offered in selection
  // mode.
  renderActionsDropDown: function() {
    if (this.isEditingName() || this.options.selectionHandler) {
      return;
    }

    this.appendSubview(new DropDownButtonView({
      items: this.menuItems,
      title: I18n.t('pageflow.editor.views.folder_item_view.actions'),
      alignMenu: 'right',
      ellipsisIcon: true,
      borderless: true,
      openOnClick: true
    }), {to: this.ui.actions});
  },

  isEditingName: function() {
    return this.model.isNew() || !!this.renaming;
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

  // Rerendering removes the input, which can trigger another blur.
  commit: function() {
    if (!this.isEditingName()) {
      return;
    }

    var name = this.ui.input.val().trim();

    if (this.model.isNew()) {
      if (!name) {
        return this.discard();
      }

      this.model.set('name', name);
      return this.model.save();
    }

    this.renaming = false;
    this.render();

    if (name) {
      this.model.set('name', name);
    }
  },

  discard: function() {
    if (this.model.isNew()) {
      this.model.collection?.remove(this.model);
    }
    else if (this.renaming) {
      this.renaming = false;
      this.render();
    }
  }
});
