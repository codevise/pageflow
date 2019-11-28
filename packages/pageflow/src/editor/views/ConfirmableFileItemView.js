import Marionette from 'backbone.marionette';

import template from '../templates/confirmableFileItem.jst';

export const ConfirmableFileItemView = Marionette.ItemView.extend({
  tagName: 'li',
  template,

  ui: {
    fileName: '.file_name',
    duration: '.duration',

    label: 'label',
    checkBox: 'input',
    removeButton: '.remove',
  },

  events: {
    'click .remove': 'destroy',

    'change input': 'updateSelection'
  },

  onRender: function() {
    this.ui.label.attr('for', this.cid);
    this.ui.checkBox.attr('id', this.cid);
    this.ui.checkBox.prop('checked', this.options.selectedFiles.contains(this.model));

    this.ui.fileName.text(this.model.get('file_name') || '(Unbekannt)');
    this.ui.duration.text(this.model.get('duration') || '-');
  },

  destroy: function() {
    if (confirm("Datei wirklich wirklich löschen?")) {
      this.model.destroy();
    }
  },

  updateSelection: function() {
    if (this.ui.checkBox.is(':checked')) {
      this.options.selectedFiles.add(this.model);
    }
    else {
      this.options.selectedFiles.remove(this.model);
    }
  },
});