pageflow.ConfigurationEditorTabView = Backbone.Marionette.View.extend({
  className: 'configuration_editor',

  initialize: function() {
    this.groups = this.options.groups || pageflow.ConfigurationEditorTabView.groups;
  },

  input: function(propertyName, view, options) {
    this.view(view, _.extend({
      placeholderModel: this.options.placeholderModel,
      propertyName: propertyName
    }, options || {}));
  },

  view: function(view, options) {
    this.inputs = this.inputs || new Backbone.ChildViewContainer();
    this.inputs.add(new view(_.extend({
      model: this.model,
    }, options || {})));
  },

  group: function(name) {
    this.groups.apply(name, this);
  },

  render: function() {
    this.inputs.each(function(input) {
      this.$el.append(input.render().el);
    }, this);

    return this;
  },

  onClose: function() {
    if (this.inputs) {
      this.inputs.call('close');
    }
  }
});

pageflow.ConfigurationEditorTabView.Groups = function() {
  var groups = {};

  this.define = function(name, fn) {
    if (typeof fn !== 'function') {
      throw 'Group has to be function.';
    }

    groups[name] = fn;
  };

  this.apply = function(name, context) {
    if (!(name in groups)) {
      throw 'Undefined group named "' + name + '".';
    }

    groups[name].call(context);
  };
};

pageflow.ConfigurationEditorTabView.groups = new pageflow.ConfigurationEditorTabView.Groups();