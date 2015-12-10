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

pageflow.pageTransitions.register('fade', {duration: 1100});
pageflow.pageTransitions.register('crossfade', {duration: 1100});
pageflow.pageTransitions.register('fade_to_black', {duration: 2100});
pageflow.pageTransitions.register('cut', {duration: 1100});
pageflow.pageTransitions.register('scroll', {duration: 1100});
pageflow.pageTransitions.register('scroll_right', {duration: 1100});
pageflow.pageTransitions.register('scroll_left', {duration: 1100});
pageflow.pageTransitions.register('scroll_over_from_right', {duration: 1100});
pageflow.pageTransitions.register('scroll_over_from_left', {duration: 1100});