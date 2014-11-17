pageflow.Widget = Backbone.Model.extend({
  paramRoot: 'widget',
  i18nKey: 'pageflow/widget',

  role: function() {
    return this.id;
  },

  urlRoot: function() {
    return this.collection.url();
  },

  toJSON: function() {
    return {
      role: this.role(),
      type_name: this.get('type_name')
    };
  },
});