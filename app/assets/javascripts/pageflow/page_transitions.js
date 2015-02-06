pageflow.pageTransitions = {
  repository: {},

  register: function(name, options) {
    this.repository[name] = options;
  },

  get: function(name) {
    if (!this.repository.hasOwnProperty(name)) {
      throw 'Unknown page transition "' + name + '"';
    }

    return this.repository[name];
  },

  names: function() {
    return _.keys(this.repository);
  }
};

pageflow.pageTransitions.register('scroll', {duration: 1100});
pageflow.pageTransitions.register('fade', {duration: 1100});