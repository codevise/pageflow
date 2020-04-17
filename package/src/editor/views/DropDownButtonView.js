import Marionette from 'backbone.marionette';
import _ from 'underscore';

import {DropDownButtonItemListView} from './DropDownButtonItemListView';

import template from '../templates/dropDownButton.jst';

/**
 * A button that displays a drop down menu on hover.
 *
 * @param {Object} options
 *
 * @param {String} options.label
 *   Button text.
 *
 * @param {Backbone.Collection} options.items
 *   Collection of menu items. See below for supported attributes.
 *
 * ## Item Models
 *
 * The following model attributes can be used to control the
 * appearance of a menu item:
 *
 * - `name` - A name for the menu item which is not displayed.
 * - `label` - Used as menu item label.
 * - `disabled` - Make the menu item inactive.
 * - `checked` - Display a check mark in front of the item
 * - `items` - A Backbone collection of nested menu items.
 *
 * If the menu item model provdised a `selected` method, it is called
 * when the menu item is clicked.
 *
 * @class
 */
export const DropDownButtonView = Marionette.ItemView.extend({
  template,
  className: 'drop_down_button',

  ui: {
    button: '> button',
    menu: '.drop_down_button_menu'
  },

  events: {
    'mouseenter': function() {
      this.positionMenu();
      this.showMenu();
    },

    'mouseleave': function() {
      this.scheduleHideMenu();
    }
  },

  onRender: function() {
    var view = this;

    this.ui.button.toggleClass('has_icon_and_text', !!this.options.label);
    this.ui.button.toggleClass('has_icon_only', !this.options.label);

    this.ui.button.text(this.options.label);

    this.ui.menu.append(this.subview(new DropDownButtonItemListView({
      items: this.options.items
    })).el);

    this.ui.menu.on({
      'mouseenter': function() {
        view.showMenu();
      },

      'mouseleave': function() {
        view.scheduleHideMenu();
      }
    });

    this.ui.menu.appendTo('#editor_menu_container');
  },

  onClose: function() {
    this.ui.menu.remove();
  },

  positionMenu: function() {
    var offset = this.$el.offset();

    this.ui.menu.css({
      top: offset.top + this.$el.height(),
      left: offset.left
    });
  },

  showMenu: function() {
    this.ensureOnlyOneDropDownButtonShowsMenu();

    clearTimeout(this.hideMenuTimeout);
    this.ui.menu.addClass('is_visible');
  },

  ensureOnlyOneDropDownButtonShowsMenu: function() {
    if (DropDownButtonView.currentlyShowingMenu) {
      DropDownButtonView.currentlyShowingMenu.hideMenu();
    }

    DropDownButtonView.currentlyShowingMenu = this;
  },

  hideMenu: function() {
    clearTimeout(this.hideMenuTimeout);

    if (!this.isClosed) {
      this.ui.menu.removeClass('is_visible');
    }
  },

  scheduleHideMenu: function() {
    this.hideMenuTimeout = setTimeout(_.bind(this.hideMenu, this), 300);
  }
});
