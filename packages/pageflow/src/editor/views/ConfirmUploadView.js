import Backbone from 'backbone';
import Marionette from 'backbone.marionette';

import {app} from '../app';

import {EditFileView} from './EditFileView';
import {UploadableFilesView} from './UploadableFilesView';
import {dialogView} from './mixins/dialogView';

import template from '../templates/confirmUpload.jst';

export const ConfirmUploadView = Marionette.Layout.extend({
  template,
  className: 'confirm_upload editor dialog',

  mixins: [dialogView],

  regions: {
    selectedFileRegion: '.selected_file_region'
  },

  ui: {
    filesPanel: '.files_panel',
  },

  events: {
    'click .upload': function() {
      this.options.fileUploader.submit();
      this.close();
    }
  },

  initialize: function() {
    this.selection = new Backbone.Model();
    this.listenTo(this.selection, 'change', this.update);
  },

  onRender: function() {
    this.options.fileTypes.each(function(fileType) {
      this.ui.filesPanel.append(this.subview(new UploadableFilesView({
        collection: this.options.files[fileType.collectionName],
        fileType: fileType,
        selection: this.selection
      })).el);
    }, this);

    this.update();
  },

  onClose: function() {
    this.options.fileUploader.abort();
  },

  update: function() {
    var file = this.selection.get('file');

    if (file) {
      this.selectedFileRegion.show(new EditFileView({
        model: file
      }));
    }
    else {
      this.selectedFileRegion.close();
    }
  }
});

ConfirmUploadView.watch = function(fileUploader, fileTypes, files) {
  fileUploader.on('new:batch', function() {
    ConfirmUploadView.open({
      fileUploader: fileUploader,
      fileTypes: fileTypes,
      files: files
    });
  });
};

ConfirmUploadView.open = function(options) {
  app.dialogRegion.show(new ConfirmUploadView(options));
};