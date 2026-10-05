import Marionette from 'backbone.marionette';

import template from '../templates/explorerFolderItem.jst';

export const ExplorerFolderItemView = Marionette.ItemView.extend({
  tagName: 'li',
  className: 'explorer_folder_item',
  template,

  ui: {
    name: '.file_name'
  },

  events: {
    'click': function() {
      this.options.onSelectFolder(this.model);
    }
  },

  modelEvents: {
    'change:name': 'update'
  },

  onRender: function() {
    this.update();
  },

  update: function() {
    this.ui.name.text(this.model.get('name'));
  }
});
