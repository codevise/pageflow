pageflow.TabsView = Backbone.Marionette.Layout.extend({
  template: 'pageflow/ui/templates/tabs_view',
  className: 'tabs_view',

  ui: {
    headers: '> ul',
  },

  regions: {
    container: '> div'
  },

  events: {
    'click > ul > li': function(event) {
      this.changeTab($(event.target).data('tab-name'));
    }
  },

  initialize: function() {
    this.tabFactoryFns = {};
    this.tabNames = [];
    this.currentTabName = null;
  },

  tab: function(name, factoryFn) {
    this.tabFactoryFns[name] = factoryFn;
    this.tabNames.push(name);
  },

  onRender: function() {
    _.each(this.tabNames, function(name) {
      this.ui.headers.append(
        $('<li />')
          .attr('data-tab-name', name)
          .text(I18n.t(this.options.i18n + '.' + name))
      );
    }, this);

    this.changeTab(this.defaultTab());
  },

  changeTab: function(name) {
    this.container.show(this.tabFactoryFns[name]());
    this._updateActiveHeader(name);
    this.currentTabName = name;
  },

  defaultTab: function() {
    if (_.include(this.tabNames, this.options.defaultTab)) {
      return this.options.defaultTab;
    }
    else {
      return _.first(this.tabNames);
    }
  },

  refresh: function() {
    this.changeTab(this.currentTabName);
  },

  toggleSpinnerOnTab: function(name, visible) {
    this.$('[data-tab-name=' + name + ']').toggleClass('spinner', visible);
  },

  _updateActiveHeader: function(activeTabName) {
    this.ui.headers.children().each(function() {
      $(this).toggleClass('active', $(this).data('tab-name') === activeTabName);
    });
  }
});
