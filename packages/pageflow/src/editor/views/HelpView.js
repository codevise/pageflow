import $ from 'jquery';
import Marionette from 'backbone.marionette';

import {app} from '../app';
import {editor} from '../base';

import template from '../templates/help.jst';

export const HelpView = Marionette.ItemView.extend({
  template,
  className: 'help',

  ui: {
    placeholder: '.placeholder',
    sections: 'section',
    menuItems: 'li'
  },

  events: {
    'click .close': function() {
      this.toggle();
    },

    'click .expandable > a': function(event) {
      $(event.currentTarget).parents('.expandable').toggleClass('expanded');
    },

    'click a': function(event) {
      var link = $(event.currentTarget);

      if (link.attr('href').indexOf('#') === 0) {
        this.showSection(link.attr('href').substring(1),
                         {scrollIntoView: !link.parents('nav').length});
      }
      else if (link.attr('href').match(/^http/)) {
        window.open(link.attr('href'), '_blank');
      }

      return false;
    },

    'click .box': function() {
      return false;
    },

    'click': function() {
      this.toggle();
    }
  },

  initialize: function() {
    this.listenTo(app, 'toggle-help', function(name) {
      this.toggle();
      this.showSection(name ||
                       editor.defaultHelpEntry ||
                       this.defaultHelpEntry(),
                       {scrollIntoView: true});
    });
  },

  onRender: function() {
    this.ui.placeholder.replaceWith($('#help_entries_seed').html());
    this.bindUIElements();
  },

  toggle: function() {
    this.$el.toggle();
  },

  defaultHelpEntry: function() {
    return this.ui.sections.first().data('name');
  },

  showSection: function(name, options) {
    this.ui.menuItems.each(function() {
      var menuItem = $(this);
      var active = (menuItem.find('a').attr('href') === '#' + name);
      menuItem.toggleClass('active', active);

      if (active) {
        menuItem.parents('.expandable').addClass('expanded');

        if (options.scrollIntoView) {
          menuItem[0].scrollIntoView();
        }
      }
    });

    this.ui.sections.each(function() {
      var section = $(this);
      section.toggle(section.data('name') === name);
    });
  }
});