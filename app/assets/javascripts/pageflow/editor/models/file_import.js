pageflow.FileImport = Backbone.Model.extend({
  modelName: 'file_import',
  action: 'search',
  url: function () {
    var slug = pageflow.entry.get('slug');
    return '/editor/entries/'+slug+'/file_import/'+this.importer.key+'/'+this.action
  },
  initialize: function(importer_key) {
    this.importer = pageflow.editor.fileImporters.find(importer_key)
    this.set('selectedFiles', []);
    this.authenticationInterval = setInterval(this.authenticate.bind(this), 3000);
  },
  authenticate: function () {
    this.action = 'authenticate_importer'
    var self = this;
    if (!this.popUped) {
      this.fetch().then(function (data) {
        if (data) {
          if (data.authenticationRequired) {
            function centerPopup(linkUrl, width, height) {
              var sep = (linkUrl.indexOf('?') !== -1) ? '&' : '?',
                  url = linkUrl + sep + 'popup=true',
                  left = (screen.width - width) / 2 - 16,
                  top = (screen.height - height) / 2 - 50,
                  windowFeatures = 'menubar=no,toolbar=no,status=no,width=' + width +
                      ',height=' + height + ',left=' + left + ',top=' + top;
              return window.open(url, 'authPopup', windowFeatures);
            }
            centerPopup("/auth/"+data.provider,800, 600);
            window.pageflow.editor.tempFileModel = self;
            self.popUped = true;
          } else {
            self.authenticateCallback()
          }
        }
      });  
    }
    
  },
  authenticateCallback: function () {
    clearInterval(this.authenticationInterval);
    this.set('isAuthenticated', true);
    window.pageflow.editor.tempFileModel = undefined;
    this.popUped = false;
  },
  createFileImportDialogView: function () {
    return this.importer.createFileImportDialogView(this);
  },
  select: function(options) {
    this.get('selectedFiles').push(options);
    this.trigger('change');
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
    this.action = 'search';
    return this.fetchData({
      data: {
        query: query
      }
    });
  },
  nextPage: function () {
    var nextPageURL = this.get('nextPageURL');
    if (nextPageURL) {
      this.action = 'search' + nextPageURL.search;
      return this.fetchData();
    }
  },
  previousPage: function () {
    var prevPageURL = this.get('previousPageURL');
    if (prevPageURL) {
      this.action = 'search' + prevPageURL.search;
      return this.fetchData();
    }
  },
  fetchData: function (options) {
    this.set('nextPageURL', undefined);
    this.set('previousPageURL', undefined);
    var self = this;
    return this.fetch(options).then(function (data) {
      if (data.next_page) {
        self.set('nextPageURL', new URL(data.next_page));
      }
      if (data.prev_page) {
        self.set('previousPageURL', new URL(data.prev_page));
      }
      self.set('currentPage', data.page);
      return data;
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
    var selections = pageflow.files[collectionName].uploadable();
    selections.each(function (selection) {
      selection.destroy();
    });
  },
  startImportJob: function (collectionName) {
    this.action = 'start_import_job';
    var selections = pageflow.files[collectionName].uploadable();
    this.fetch({
      data: {
        collection: collectionName,
        files: selections.toJSON()
      },
      postData: true,
      type: 'POST'
    }).then(function (data) {
      if (data && data.data) {
        var files = data.data;
        if (files && files.length>0) {
          files.forEach(function (file) {
            var localFile = selections.find(function (cFile) {
              return cFile.get('attachment_on_s3_file_name') == file.file_name && 
                cFile.get('url') == file.source_url && cFile.get('state') == 'uploadable'
            });
            if (localFile) {
              pageflow.files[collectionName].remove(localFile)
              var fileType = pageflow.editor.fileTypes.findByUpload(file);
              var file = new fileType.model(file, {
                fileType: fileType
              });

              pageflow.entry.getFileCollection(fileType).add(file);
              file.set('state', 'uploading');
            }
          });
        }
      }
    });
  },
  downloadFile: function (options) {
    this.action = 'download_file';
    return this.fetch({
      data: {
        file: options.file
      }
    });
  }
});

