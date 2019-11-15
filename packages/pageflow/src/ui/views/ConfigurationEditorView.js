/**
 * Render a inputs on multiple tabs.
 *
 * @param {string} [options.model]
 *   Backbone model to use for input views.
 *
 * @param {string} [options.placeholderModel]
 *   Backbone model to read placeholder values from.

 * @param {string} [options.tab]
 *   Name of the tab to enable by default.
 *
 * @param {string[]} [options.attributeTranslationKeyPrefixes]
 *   List of prefixes to use in input views for attribute based transltions.
 *
 * @param {string[]} [options.tabTranslationKeyPrefixes]
 *   List of prefixes to append tab name to. First exisiting translation is used as label.
 *
 * @param {string} [options.tabTranslationKeyPrefix]
 *   Prefixes to append tab name to.
 *
 * @class
 * @memberof module:pageflow/ui
 */
pageflow.ConfigurationEditorView = Backbone.Marionette.View.extend({
  className: 'configuration_editor',

  initialize: function() {
    this.tabsView = new pageflow.TabsView({
      translationKeyPrefixes: this.options.tabTranslationKeyPrefixes ||
                              [this.options.tabTranslationKeyPrefix],
      fallbackTranslationKeyPrefix: 'pageflow.ui.configuration_editor.tabs',
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
        tab: name,
        attributeTranslationKeyPrefixes: this.options.attributeTranslationKeyPrefixes
      });

      callback.call(tabView);
      return tabView;
    }, this));
  },

  /**
   * Rerender current tab.
   */
  refresh: function() {
    this.tabsView.refresh();
  },

  /**
   * Adjust tabs scroller to changed width of view.
   */
  refreshScroller: function() {
    this.tabsView.refreshScroller();
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
