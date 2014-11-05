pageflow.WidgetsCollection = Backbone.Collection.extend({
  model: pageflow.Widget,

  initialize: function(models, options) {
    options = options || {};
    this.subject = options.subject;
  },

  url: function() {
    return this.subject.widgetsUrlRoot() + '/widgets';
  },
});

pageflow.WidgetsCollection.createForSubject = function(subject) {
  return new pageflow.WidgetsCollection([], {subject: subject});
};