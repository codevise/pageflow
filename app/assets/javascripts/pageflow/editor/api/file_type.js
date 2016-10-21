pageflow.FileType = pageflow.Object.extend({
  initialize: function(options) {
    this.model = options.model;

    this.typeName = options.typeName;
    this.collectionName = options.collectionName;
    this.paramKey = options.paramKey;
    this.i18nKey = options.i18nKey;

    this.confirmUploadTableColumns = options.confirmUploadTableColumns || [];
    this.configurationEditorInputs = [].concat(options.configurationEditorInputs || []);
    this.configurationUpdaters = options.configurationUpdaters || [];
    this.metaDataAttributes = options.metaDataAttributes || [];
    this.filters = options.filters || [];

    this.settingsDialogTabs = [
      {
        name: 'general',
        view: pageflow.EditFileView
      }
    ].concat(options.settingsDialogTabs || []);

    if (typeof options.matchUpload === 'function') {
      this.matchUpload = options.matchUpload;
    }
    else if (options.matchUpload instanceof RegExp)  {
      this.matchUpload = function(upload) {
        return upload.type.match(options.matchUpload);
      };
    }
    else {
      throw 'matchUpload option of FileType "' + this.collectionName + '" must either be a function or a RegExp.';
    }

    this.setupModelNaming();
  },

  setupModelNaming: function() {
    this.model.prototype.modelName = this.model.prototype.modelName || this.paramKey;
    this.model.prototype.paramRoot = this.model.prototype.paramRoot || this.paramKey;
    this.model.prototype.i18nKey = this.model.prototype.i18nKey || this.i18nKey;
  },

  getFilter: function(name) {
    var result =  _(this.filters).find(function(filter) {
      return filter.name === name;
    });

    if (!result) {
      throw new Error('Unknown filter "' + name + '" for file type "' + this.collectionName + '".');
    }

    return result;
  }
});