support.setupGlobals = function(mapping) {
  beforeEach('setup globals', function() {
    if (this.globalsBackup) {
      throw new Error('There can only be one setupGlobals call per test.');
    }

    this.globalsBackup = {};

    _.each(mapping, function(value, key) {
      this.globalsBackup[key] = pageflow[key];
      pageflow[key] = typeof value === 'function' ? value.call(this) : value;
    }, this);
  });

  afterEach('setup globals', function() {
    _.each(mapping, function(_, key) {
      pageflow[key] = this.globalsBackup[key];
    }, this);

    this.globalsBackup = null;
  });
};
