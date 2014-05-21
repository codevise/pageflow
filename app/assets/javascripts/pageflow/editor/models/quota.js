pageflow.Quota = Backbone.Model.extend({
  modelName: 'quota',
  paramRoot: 'quota',

  url: function() {
    return '/editor/quotas/' + this.id;
  },

  isExhausted: function() {
    return this.get('state') !== 'available';
  }
});

pageflow.Quota.byName = function(name, options) {
  return new pageflow.Quota({
    id: name
  }, options);
};