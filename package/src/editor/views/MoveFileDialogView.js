import $ from 'jquery';
import I18n from 'i18n-js';
import Marionette from 'backbone.marionette';

import {app} from '../app';

import {dialogView} from './mixins/dialogView';

import template from '../templates/moveFileDialog.jst';

export const MoveFileDialogView = Marionette.ItemView.extend({
  template,
  className: 'move_file_dialog editor dialog',

  mixins: [dialogView],

  ui: {
    hint: '.move_file_dialog-hint',
    targets: '.move_file_dialog-targets'
  },

  events: {
    'click .move_file_dialog-target': function(event) {
      this.move($(event.currentTarget).data('folder'));
      return false;
    }
  },

  onRender: function() {
    this.ui.hint.text(this.translation('hint', {file: this.model.title()}));

    // Nesting the folders inside the target which stands for the root
    // matches the tree they form and takes care of indenting them.
    this.ui.targets.append(this.targetItem());
  },

  targetItem: function(folder) {
    var item = $('<li />', {'class': 'move_file_dialog-target_item'})
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
    var current = this.permaIdOf(folder) === this.model.get('folder_perma_id');

    var button = $('<button />', {
      'class': 'move_file_dialog-target',
      type: 'button',
      disabled: current,
      'aria-current': current ? 'true' : null
    }).data('folder', folder);

    button.append($('<span />', {'class': 'move_file_dialog-pictogram',
                                 'aria-hidden': 'true'}));

    button.append($('<span />', {
      'class': 'move_file_dialog-name',
      text: folder ? folder.get('name') : this.translation('root')
    }));

    if (current) {
      button.append($('<span />', {'class': 'move_file_dialog-current',
                                   text: this.translation('current')}));
    }

    return button;
  },

  move: function(folder) {
    this.model.set('folder_perma_id', this.permaIdOf(folder));
    this.close();
  },

  permaIdOf: function(folder) {
    return folder ? folder.get('perma_id') : null;
  },

  translation: function(keyName, options) {
    return I18n.t('pageflow.editor.views.move_file_dialog_view.' + keyName, options);
  }
});

MoveFileDialogView.open = function(options) {
  app.dialogRegion.show(new MoveFileDialogView(options));
};
