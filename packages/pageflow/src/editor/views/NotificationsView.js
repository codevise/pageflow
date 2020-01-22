import Marionette from 'backbone.marionette';

import {editor} from '../base';

import {state} from '$state';

import template from '../templates/notifications.jst';

export const NotificationsView = Marionette.ItemView.extend({
  className: 'notifications',
  tagName: 'ul',
  template,

  ui: {
    failedCount: '.failed .count',
    uploadingCount: '.uploading .count',
    confirmableFilesCount: '.confirmable_files .count',
  },

  events: {
    'click .retry': function() {
      editor.failures.retry();
    }
  },

  onRender: function() {
    this.listenTo(state.entry, 'change:uploading_files_count', this.notifyUploadCount);
    this.listenTo(state.entry, 'change:confirmable_files_count', this.notifyConfirmableFilesCount);

    this.listenTo(editor.savingRecords, 'add', this.update);
    this.listenTo(editor.savingRecords, 'remove', this.update);

    this.listenTo(editor.failures, 'add', this.update);
    this.listenTo(editor.failures, 'remove', this.update);

    this.update();
    this.notifyConfirmableFilesCount();
  },

  update: function() {
    this.$el.toggleClass('failed', !editor.failures.isEmpty());
    this.$el.toggleClass('saving', !editor.savingRecords.isEmpty());
    this.ui.failedCount.text(editor.failures.count());
  },

  notifyUploadCount: function(model, uploadCount) {
    this.$el.toggleClass('uploading', uploadCount > 0);
    this.ui.uploadingCount.text(uploadCount);
  },

  notifyConfirmableFilesCount: function() {
    var confirmableFilesCount = state.entry.get('confirmable_files_count');

    this.$el.toggleClass('has_confirmable_files', confirmableFilesCount > 0);
    this.ui.confirmableFilesCount.text(confirmableFilesCount);
  }
});
