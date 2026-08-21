import Backbone from 'backbone';
import I18n from 'i18n-js';
import Marionette from 'backbone.marionette';

import {DropDownButtonView} from './DropDownButtonView';
import {MoveToFolderDialogView} from './MoveToFolderDialogView';
import {listHighlighting} from './mixins/listHighlighting';
import {parentFolderLabel} from './mixins/parentFolderLabel';

import template from '../templates/folderItem.jst';

export const FolderItemView = Marionette.ItemView.extend({
  template,
  tagName: 'li',
  className: 'file_folders-item',

  mixins: [listHighlighting, parentFolderLabel],

  ui: {
    name: '.file_folders-name',
    checkBox: '.file_folders-check_box',
    fileCount: '.file_folders-file_count',
    actions: '.file_folders-actions',
    input: '.file_folders-input'
  },

  events: {
    'click .file_folders-button': 'select',

    'change .file_folders-check_box': function() {
      this.options.listSelection.toggle(this.model);
    },

    'keydown .file_folders-input': 'handleInputKeyDown',
    'blur .file_folders-input': 'commit'
  },

  modelEvents: {
    // Rerender to replace the name input with the row of the created
    // folder.
    'change:id': 'render',
    'change:name': 'update',
    'change:parent_folder_perma_id': 'updateParentFolder'
  },

  parentFolderPermaId: function() {
    return this.model.get('parent_folder_perma_id');
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

    this.listenTo(this.options.fileFolders,
                  'add remove change:id change:parent_folder_perma_id',
                  this.updateMoveItem);

    if (this.multiSelectable()) {
      this.listenTo(this.options.listSelection, 'add remove reset', this.updateSelected);

      // The button which navigates into the folder gives way to the check
      // box, so the row has to be built again.
      this.listenTo(this.options.listSelection, 'change:selecting', this.render);
    }
  },

  createMenuItems: function() {
    var items = new Backbone.Collection([
      {
        name: 'rename',
        label: I18n.t('pageflow.editor.views.folder_item_view.rename')
      },
      {
        name: 'move',
        label: I18n.t('pageflow.editor.views.folder_item_view.move')
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

    items.findWhere({name: 'move'}).selected = () => this.move();

    items.findWhere({name: 'destroy'}).selected = () => this.model.destroy();

    return items;
  },

  move: function() {
    MoveToFolderDialogView.open({
      models: [this.model],
      fileFolders: this.options.fileFolders
    });
  },

  // Moving a folder out to the top level is always an option, while a
  // folder which already is at the top level needs some other folder
  // outside its own subtree to move into.
  updateMoveItem: function() {
    var folders = this.options.fileFolders;
    var ownPermaIds = folders.descendantPermaIdsOf(this.model);

    var movable = !this.model.isNew() &&
                  (this.model.get('parent_folder_perma_id') !== null ||
                   folders.some(function(folder) {
                     return !folder.isNew() &&
                            ownPermaIds.indexOf(folder.get('perma_id')) < 0;
                   }));

    this.menuItems.findWhere({name: 'move'}).set('hidden', !movable);
  },

  // Files hidden by the file type filter cannot make a folder look
  // empty, since such a folder is not listed to begin with.
  updateDestroyItem: function() {
    var empty = this.options.fileFolders.isEmptyFolder(this.model, this.options.files);

    this.menuItems.findWhere({name: 'destroy'}).set('hidden', !empty);
  },

  serializeData: function() {
    return {
      naming: this.isEditingName(),
      selecting: this.isSelecting(),
      nameLabel: I18n.t(this.renaming ?
                        'pageflow.editor.views.folder_item_view.new_name' :
                        'pageflow.editor.views.folder_item_view.name')
    };
  },

  onRender: function() {
    this.$el.toggleClass('selectable', !!this.options.selectionHandler);

    this.$el.toggleClass('naming', this.isEditingName());
    this.update();
    this.updateSelected();
    this.updateFileCount();
    this.updateDestroyItem();
    this.updateMoveItem();
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

  isSelecting: function() {
    return this.multiSelectable() && this.options.listSelection.isSelecting();
  },

  multiSelectable: function() {
    return !this.options.selectionHandler && !!this.options.listSelection;
  },

  updateSelected: function() {
    if (this.isClosed) {
      return;
    }

    var selected = this.isSelecting() && this.options.listSelection.includes(this.model);

    this.ui.checkBox.prop('checked', selected);
    this.$el.toggleClass('is_selected', selected);
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
