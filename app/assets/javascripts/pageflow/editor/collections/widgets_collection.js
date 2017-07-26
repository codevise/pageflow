pageflow.WidgetsCollection = Backbone.Collection.extend({
  model: pageflow.Widget,

  initialize: function() {
    this.listenTo(this, 'change:type_name change:configuration', function() {
      this.batchSave();
    });
  },

  url: function() {
    return '/editor/subjects/entries/' + this.subject.id + '/widgets';
  },

  batchSave: function(options) {
    var subject = this.subject;

    return Backbone.sync('patch', subject, _.extend(options || {}, {
      url: this.url() + '/batch',

      attrs: {
        widgets: this.map(function(widget) {
          return widget.toJSON();
        })
      },

      success: function(response) {
        subject.trigger('sync:widgets', subject, response, {});
      }
    }));
  }
});
