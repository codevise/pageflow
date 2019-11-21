import Backbone from 'backbone';
import Marionette from 'backbone.marionette';

import template from '../templates/confirmUpload.jst';
import {dialogView} from './mixins/dialogView';
import {UploadableFilesView} from './UploadableFilesView'
import {app} from '../app';
import {state} from '$state';

export const ConfirmFileImportUploadView = Marionette.Layout.extend({
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
      this.onImport();
    },
    'click .close': function () {
      this.closeMe();
    }
  },
  getSelectedFiles: function () {
    var files = [];
    for (var key in state.files) {
      if (state.files.hasOwnProperty(key)) {
        var collection = state.files[key];
        if (collection.length>0) {
          files = files.concat(collection.toJSON());
        }
      }
    }
    return files;
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
  onImport: function () {
    var cName = this.options.fileImportModel.get('metaData').collection;
    this.options.fileImportModel.get('importer').startImportJob(cName);
    this.close();
  },
  closeMe: function() {
    var cName = this.options.fileImportModel.get('metaData').collection;
    this.options.fileImportModel.get('importer').cancelImport(cName);
    this.close();
  },

  update: function() {
    var file = this.selection.get('file');

    if (file) {
      this.selectedFileRegion.show(new pageflow.EditFileView({
        model: file
      }));
    }
    else {
      this.selectedFileRegion.close();
    }
  }
});


ConfirmFileImportUploadView.open = function(options) {
  app.dialogRegion.show(new ConfirmFileImportUploadView(options));
};