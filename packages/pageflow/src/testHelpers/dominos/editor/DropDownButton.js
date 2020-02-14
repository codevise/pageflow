import $ from 'jquery';

import {Base} from '../Base';

export const DropDownButton = Base.extend({
  selector: '.drop_down_button',

  menuItemNames: function() {
    return this.$el.find('li').map(function() {
      return $(this).data('name');
    }).get();
  },

  menuItemLabels: function() {
    return this.$el.find('li a').map(function() {
      return $(this).text();
    }).get();
  },

  selectMenuItemByName: function(name) {
    var menuItem = this.$el.find('li').filter(function() {
      return $(this).data('name') == name;
    });

    if (!menuItem.length) {
      throw new Error('Could not find menu item with name "' + name + '"');
    }

    menuItem.find('a').trigger('click');
  },

  selectMenuItemByLabel: function(label) {
    var menuItemLink = this.$el.find('li a').filter(function() {
      return $(this).text() == label;
    });

    if (!menuItemLink.length) {
      throw new Error('Could not find menu item with label "' + label + '"');
    }

    menuItemLink.trigger('click');
  }
});
