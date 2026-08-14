import Marionette from 'backbone.marionette';

import template from '../templates/fileStageIcon.jst';

export const FileStageIconView = Marionette.ItemView.extend({
  tagName: 'span',
  className: 'file_stage_icon',
  template,

  attributes: {
    'aria-hidden': 'true'
  },

  ui: {
    spinner: '.file_stage_icon-spinner',
    alert: '.file_stage_icon-alert',
    bell: '.file_stage_icon-bell'
  },

  modelEvents: {
    'change': 'update'
  },

  onRender: function() {
    this.update();
  },

  update: function() {
    var failed = !!this.model.get('failed');
    var actionRequired = !!this.model.get('action_required');

    this.ui.spinner.toggle(!failed && !actionRequired);
    this.ui.alert.toggle(failed);
    this.ui.bell.toggle(actionRequired);
  }
});
