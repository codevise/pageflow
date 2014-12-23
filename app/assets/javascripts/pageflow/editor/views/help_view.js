pageflow.HelpView = Backbone.Marionette.ItemView.extend({
  className: 'help',

  defaultSection: 'outline',

  getTemplate: function(){
    return 'templates/help.' + I18n.locale;
  },

  routeSectionMapping: {
    'pages': 'page',
    'files': 'files',
    'publish': 'publish'
  },

  ui: {
    breakButton: '.break',
    message: '.error .message',
    sections: 'section',
    menuItems: 'li'
  },

  events: {
    'click .close': function() {
      this.toggle();
    },

    'click li': function(event) {
      this.showSection($(event.currentTarget).data('section'));
    },

    'click .box': function() {
      return false;
    },

    'click': function() {
      this.toggle();
    }
  },

  initialize: function() {
    this.listenTo(pageflow.app, 'toggle-help', function() {
      this.chooseSectionFromFragment();
      this.toggle();
    });
  },

  toggle: function() {
    this.$el.toggle();
  },

  chooseSectionFromFragment: function() {
    var route = _.chain(this.routeSectionMapping).keys().find(function(route) {
      if (Backbone.history.fragment.indexOf(route) >= 0) {
        return true;
      }
    }, this).value();

    this.showSection(this.routeSectionMapping[route] || this.defaultSection);
  },

  showSection: function(name) {
    this.ui.menuItems.each(function() {
      var menuItem = $(this);
      menuItem.toggleClass('active', menuItem.data('section') === name);
    });

    this.ui.sections.each(function() {
      var section = $(this);
      section.toggle(section.data('name') === name);
    });
  }
});