import $ from 'jquery';
import I18n from 'i18n-js';
import Marionette from 'backbone.marionette';

import {app} from '../app';

import {FileFolder} from '../models/FileFolder';

import {dialogView} from './mixins/dialogView';

import template from '../templates/moveToFolderDialog.jst';

export const MoveToFolderDialogView = Marionette.ItemView.extend({
  template,
  className: 'move_to_folder_dialog editor dialog',

  mixins: [dialogView],

  ui: {
    header: '.dialog-header',
    hint: '.move_to_folder_dialog-hint',
    targets: '.move_to_folder_dialog-targets'
  },

  events: {
    'click .move_to_folder_dialog-target': function(event) {
      this.move($(event.currentTarget).data('folder'));
      return false;
    }
  },

  initialize: function() {
    this.movedFolders = this.options.models.filter(isFolder);

    // Nesting a folder inside itself or inside one of its own subfolders
    // would detach it from the folder tree.
    this.blockedPermaIds = this.movedFolders.reduce(function(permaIds, folder) {
      return permaIds.concat(this.options.fileFolders.descendantPermaIdsOf(folder));
    }.bind(this), []);
  },

  onRender: function() {
    var models = this.options.models;
    var kind = this.kind();

    this.ui.header.text(this.translation('header.' + kind, {count: models.length}));
    this.ui.hint.text(this.translation('hint.' + kind, {count: models.length,
                                                       name: models[0].title()}));

    // Nesting the folders inside the target which stands for the root
    // matches the tree they form and takes care of indenting them.
    this.ui.targets.append(this.targetItem());
  },

  // Moving files and folders at once is about neither of them in
  // particular. Such a mixed selection always holds at least two items,
  // so its translations need no singular.
  kind: function() {
    if (!this.movedFolders.length) {
      return 'files';
    }

    return this.movedFolders.length === this.options.models.length ? 'folders' : 'items';
  },

  targetItem: function(folder) {
    var item = $('<li />', {'class': 'move_to_folder_dialog-target_item'})
               .append(this.targetButton(folder));

    // Folders which are still being named have no perma id to move a
    // file into yet.
    var children = this.options.fileFolders.childrenOf(folder).filter(function(child) {
      return !child.isNew();
    });

    if (children.length) {
      var list = $('<ul />');

      children.forEach(function(child) {
        list.append(this.targetItem(child));
      }, this);

      item.append(list);
    }

    return item;
  },

  targetButton: function(folder) {
    var current = this.permaIdOf(folder) === this.currentFolderPermaId();

    var blocked = !current && !!folder &&
                  this.blockedPermaIds.indexOf(folder.get('perma_id')) >= 0;

    var button = $('<button />', {
      'class': 'move_to_folder_dialog-target',
      type: 'button',
      disabled: current || blocked,
      'aria-current': current ? 'true' : null
    }).data('folder', folder);

    button.toggleClass('is_blocked', blocked);

    button.append($('<span />', {'class': 'move_to_folder_dialog-pictogram',
                                 'aria-hidden': 'true'}));

    button.append($('<span />', {
      'class': 'move_to_folder_dialog-name',
      text: folder ? folder.get('name') : this.translation('root')
    }));

    if (current) {
      button.append($('<span />', {'class': 'move_to_folder_dialog-current',
                                   text: this.translation('current')}));
    }

    return button;
  },

  // Setting the folder an item is already in is a no op, so moving a
  // selection does not save the items which do not actually move.
  //
  // Iterating a copy since moving an item can drop it from the selection
  // which the list passed in, which would skip the items behind it.
  move: function(folder) {
    var permaId = this.permaIdOf(folder);

    this.options.models.slice().forEach(function(model) {
      model.set(folderAttribute(model), permaId);
    });

    if (this.options.onMove) {
      this.options.onMove();
    }

    this.close();
  },

  // With items from more than one folder, none of the targets is the
  // folder they are all in.
  currentFolderPermaId: function() {
    var permaIds = this.options.models.map(function(model) {
      return model.get(folderAttribute(model));
    });

    return permaIds.every(function(permaId) {
      return permaId === permaIds[0];
    }) ? permaIds[0] : undefined;
  },

  permaIdOf: function(folder) {
    return folder ? folder.get('perma_id') : null;
  },

  translation: function(keyName, options) {
    return I18n.t('pageflow.editor.views.move_to_folder_dialog_view.' + keyName, options);
  }
});

MoveToFolderDialogView.open = function(options) {
  app.dialogRegion.show(new MoveToFolderDialogView(options));
};

function folderAttribute(model) {
  return isFolder(model) ? 'parent_folder_perma_id' : 'folder_perma_id';
}

function isFolder(model) {
  return model instanceof FileFolder;
}
