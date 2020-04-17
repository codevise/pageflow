import Backbone from 'backbone';
import Marionette from 'backbone.marionette';


import {LoadingView} from './LoadingView';
import template from '../templates/filesImporter.jst';
import {dialogView} from './mixins/dialogView';
import {app} from '../app';
import {editor} from '../base'
import {FileImport} from '../models/FileImport'
import {ConfirmFileImportUploadView} from './ConfirmFileImportUploadView'
import {state} from '$state';

export const FilesImporterView = Marionette.ItemView.extend({
  template,
  className: 'files_importer editor dialog',

  mixins: [dialogView],

  ui: {
    contentPanel: '.content_panel',
    spinner: '.lds-spinner',
    importButton: '.import',
    closeButton: '.close'
  },

  events: {
    'click .import': function () {
      this.getMetaData();
    }
  },

  initialize: function(options) {
    this.model = new Backbone.Model({
      importerKey: options.importer.key,
      importer: new FileImport({
        importer: options.importer,
        currentEntry: state.entry
      })
    });

    this.listenTo(this.model.get('importer'), "change", function (event) {
      this.updateImportButton();
      if (!this.isInitialized) {
        this.updateAuthenticationView();
      }
    });
  },
  updateAuthenticationView: function () {
    var importer = this.model.get('importer')
    if (importer.get('isAuthenticated')) {
      this.ui.contentPanel.empty();
      this.ui.contentPanel.append(this.model.get('importer').createFileImportDialogView().render().el);
      this.isInitialized = true
    }
  },
  updateImportButton: function () {
    var importer = this.model.get('importer');
    this.ui.importButton.prop('disabled', importer.get('selectedFiles').length < 1);
  },
  getMetaData: function () {
    var self = this;
    this.model.get('importer').getFilesMetaData().then(function (metaData) {
      if (metaData) {
        self.model.set('metaData', metaData);
        // add each selected file meta to state.files
        for(var i = 0; i<metaData.files.length; i++){
          var file = metaData.files[i];
          var fileType = editor.fileTypes.findByUpload(file);

          file = new fileType.model({
            state: 'uploadable',
            file_name: file.name,
            content_type: file.type,
            file_size: -1,
            rights: file.rights,
            source_url: file.url
          }, {
            fileType: fileType
          });

          state.entry.getFileCollection(fileType).add(file);
        }
        ConfirmFileImportUploadView.open({
          fileTypes: editor.fileTypes,
          fileImportModel: self.model,
          files: state.files
        });
      }
    });
    this.close();
  },
  onRender: function () {
    if (!this.isInitialized) {
      this.ui.contentPanel.append(this.subview(new LoadingView({tagName: 'div'})).el);
    }
  }
});

FilesImporterView.open = function(options) {
  app.dialogRegion.show(new FilesImporterView(options).render());
};
