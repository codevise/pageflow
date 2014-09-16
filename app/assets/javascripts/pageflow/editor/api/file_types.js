pageflow.FileTypes = pageflow.Object.extend({
  initialize: function() {
    this.clientSideConfigs = [];
  },

  register: function(name, config) {
    if (this._setup) {
      throw 'File types already set up. Register file types before initializers run.';
    }

    this.clientSideConfigs[name] = config;
  },

  setup: function(serverSideConfigs) {
    var clientSideConfigs = this.clientSideConfigs;
    this._setup = true;

    this.fileTypes = _.map(serverSideConfigs, function(serverSideConfig) {
      var clientSideConfig = clientSideConfigs[serverSideConfig.collectionName];

      if (!clientSideConfig) {
        throw 'Missing client side config for file type "' + serverSideConfig.collectionName + '"';
      }

      return new pageflow.FileType(_.extend({}, serverSideConfig, clientSideConfig));
    });
  }
});

_.each(['each', 'map', 'reduce', 'first'], function(method) {
  pageflow.FileTypes.prototype[method] = function() {
    if (!this._setup) {
      throw  'File types are not yet set up.';
    }

    var args = Array.prototype.slice.call(arguments);
    args.unshift(this.fileTypes);
    return _[method].apply(_, args);
  };
});