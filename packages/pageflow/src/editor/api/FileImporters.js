import {Object} from '$pageflow/ui';

export const FileImporters = Object.extend({
  initialize: function() {
    this.importers = {};
  },
  register: function(name, config) {
    if (this._setup) {
      throw 'File importers setup is already finished. Register file importers before setup is finished';
    }

    this.importers[name] = config;
    config.key = name;
  },
  setup: function(serverSideConfigs) {
    this._setup = true;
    let importers = this.importers;
    serverSideConfigs.forEach(function (importer) {
      importers[importer.importerName]['authenticationRequired'] = importer.authenticationRequired
      importers[importer.importerName]['authenticationProvider'] = importer.authenticationProvider
    });    
  },
  find: function(name) {
    if (!this.importers[name]) {
      throw('Could not find file importer with name "' + name +'"');
    }
    return this.importers[name];
  },
  keys: function () {
    return _.keys(this.importers);
  },
  values: function () {
    return _.values(this.importers);
  }

});
