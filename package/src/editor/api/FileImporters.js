import _ from 'underscore';
import {Object} from 'pageflow/ui';

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
    let registeredImporters = this.importers;
    let importers = {}
    serverSideConfigs.forEach(function (importer) {
      let regImporter = registeredImporters[importer.importerName]
      regImporter['authenticationRequired'] = importer.authenticationRequired
      regImporter['authenticationProvider'] = importer.authenticationProvider
      regImporter['logoSource'] = importer.logoSource
      importers[importer.importerName] = regImporter
    });
    this.importers = importers;
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
