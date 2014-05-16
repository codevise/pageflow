pageflow.Quota = Backbone.Model.extend({
  modelName: 'quota',
  paramRoot: 'quota',

  url: function() {
    return '/editor/quotas/' + this.id;
  },

  isExceeded: function() {
    return this.get('state') === 'exceeded';
  }
});

pageflow.Quota.byName = function(name, options) {
  return new pageflow.Quota({
    id: name
  }, options);
};