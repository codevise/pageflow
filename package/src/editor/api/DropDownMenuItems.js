import {Object} from 'pageflow/ui';

export const DropDownMenuItems = Object.extend({
  initialize: function() {
    this.menuItems = {};
  },
  register: function(menuItem, {menuName}) {
    this.menuItems[menuName] = this.menuItems[menuName] || [];
    this.menuItems[menuName].push(menuItem);
  },
  findAllByMenuName: function(menuName) {
    return this.menuItems[menuName] || [];
  }
});
