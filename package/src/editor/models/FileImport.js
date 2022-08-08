import Backbone from 'backbone';

import {editor} from '../base';
import {authenticationProvider} from './authenticationProvider';

import {state} from '$state';

export const FileImport = Backbone.Model.extend({
  modelName: 'file_import',
  action: 'search',
  url: function () {
    var slug = this.get('currentEntry').get('slug');
    return '/editor/entries/'+slug+'/file_import/'+this.importer.key+'/'+this.action
  },
  initialize: function(options) {
    this.importer = options.importer
    this.set('selectedFiles', []);
    this.set('currentEntry', options.currentEntry);
    this.authenticationInterval = setInterval(this.authenticate.bind(this), 2000);
  },
  authenticate: function () {
    if (!this.popUped) {
      if (this.importer.authenticationRequired) {
        authenticationProvider.authenticate(this, this.importer.authenticationProvider);
        this.popUped = true;
      } else {
        this.authenticateCallback()
      }
    }
  },
  authenticateCallback: function () {
    clearInterval(this.authenticationInterval);
    this.set('isAuthenticated', true);
    this.importer.authenticationRequired = false;
    this.popUped = false;
  },
  createFileImportDialogView: function () {
    return this.importer.createFileImportDialogView(this);
  },
  select: function(options) {
    if (options instanceof Backbone.Model) {
      this.get('selectedFiles').push(options);
      this.trigger('change');
    }
  },
  unselect: function (options) {
    var index = this.get('selectedFiles').indexOf(options);
    this.get('selectedFiles').splice(index,1);
    this.trigger('change');
  },
  clearSelections: function () {
    this.set('selectedFiles', []);
  },
  search: function (query) {
    this.action = 'search/?query='+query;
    return this.fetchData();
  },
  fetchData: function (options) {
    return this.fetch(options).then(function (data) {
      if (data && data.data) {
        return data.data;
      }
    });
  },
  getFilesMetaData: function (options) {
    this.action = 'files_meta_data';
    var selectedFiles = this.get('selectedFiles');
    for(var i = 0; i < selectedFiles.length ; i++){
      selectedFiles[i] = selectedFiles[i].toJSON();
    }
    return this.fetch({
      data: {
        files: selectedFiles
      },
      postData: true,
      type: 'POST'
    }).then(function (data) {
      if (data && data.data) {
        return data.data;
      }
      else{
        return undefined;
      }
    });
  },
  cancelImport: function (collectionName) {
    var selections = state.files[collectionName].uploadable();
    selections.each(function (selection) {
      selection.destroy();
    });
    selections.clear();
  },
  startImportJob: function (collectionName) {
    this.action = 'start_import_job';

    const fileType = editor.fileTypes.findByCollectionName(collectionName);
    const currentEntry = this.get('currentEntry');
    const selections = currentEntry.getFileCollection(fileType).uploadable();

    this.sync('create', this, {
      attrs: {
        collection: collectionName,
        files: selections.toJSON().map((item, index) => ({
          ...item,
          url: selections.at(index).get('source_url')
        }))
      },

      success: function(items) {
        items.forEach(item => {
          const file = selections.find(file =>
            file.get('source_url') == item.source_url
          );

          if (file) {
            file.set(item.attributes);
          }
        });
      }
    });
  }
});
