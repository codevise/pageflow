pageflow.ConfigurationEditorView = Backbone.Marionette.View.extend({
  className: 'configuration_editor',

  initialize: function() {
    this.tabsView = new pageflow.TabsView({
      i18n: 'pageflow.ui.configuration_editor.tabs',
      defaultTab: this.options.tab
    });
    this.configure();
  },

  configure: function() {},

  tab: function(name, callback) {
    this.tabsView.tab(name, _.bind(function() {
      var tabView = new pageflow.ConfigurationEditorTabView({
        model: this.model,
        placeholderModel: this.options.placeholderModel,
        tab: name
      });

      callback.call(tabView);
      return tabView;
    }, this));
  },

  render: function() {
    this.$el.append(this.subview(this.tabsView).el);
    return this;
  }
});

_.extend(pageflow.ConfigurationEditorView, {
  repository: {},
  register: function(pageTypeName, prototype) {
    this.repository[pageTypeName] = pageflow.ConfigurationEditorView.extend(prototype);
  }
});