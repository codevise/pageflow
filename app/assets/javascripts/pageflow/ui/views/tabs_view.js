pageflow.TabsView = Backbone.Marionette.Layout.extend({
  template: 'pageflow/ui/templates/tabs_view',
  className: 'tabs_view',

  ui: {
    headers: '.tabs_view-headers',
    scroller: '.tabs_view-scroller'
  },

  regions: {
    container: '.tabs_view-container'
  },

  events: {
    'click .tabs_view-headers > li': function(event) {
      this.changeTab($(event.target).data('tab-name'));
    }
  },

  initialize: function() {
    this.tabFactoryFns = {};
    this.tabNames = [];
    this.currentTabName = null;

    this._refreshScrollerOnSideBarResize();
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

    this.scroller = new IScroll(this.ui.scroller[0], {
      scrollX: true,
      scrollY: false,
      bounce: false,
      mouseWheel: true
    });

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

  /**
   * Rerender current tab.
   */
  refresh: function() {
    this.changeTab(this.currentTabName);
  },

  /**
   * Adjust tabs scroller to changed width of view.
   */
  refreshScroller: function() {
    this.scroller.refresh();
  },

  toggleSpinnerOnTab: function(name, visible) {
    this.$('[data-tab-name=' + name + ']').toggleClass('spinner', visible);
  },

  _updateActiveHeader: function(activeTabName) {
    var scroller = this.scroller;

    this.ui.headers.children().each(function() {
      if ($(this).data('tab-name') === activeTabName) {
        scroller.scrollToElement(this, 200, true);
        $(this).addClass('active');
      }
      else {
        $(this).removeClass('active');
      }
    });
  },

  _refreshScrollerOnSideBarResize: function() {
    this.listenTo(pageflow.app, 'resize', function() {
      this.scroller.refresh();
    });
  }
});
