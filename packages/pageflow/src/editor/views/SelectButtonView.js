import $ from 'jquery';
import Marionette from 'backbone.marionette';

import template from '../templates/selectButton.jst';

export const SelectButtonView = Marionette.ItemView.extend({
  template,
  className: 'select_button',

  ui: {
    button: 'button',
    label: 'button .label',
    menu: '.dropdown-menu',
    dropdown: '.dropdown'
  },

  events: {
    'click .dropdown-menu li': function(e, x) {
      e.preventDefault();
      var index = getClickedIndex(e.target);

      this.model.get('options')[index].handler();

      function getClickedIndex(target) {
        var $target = $(target),
            index = parseInt($target.data('index'), 10);

        if (isNaN(index)) {
          index = parseInt($target.find('a').data('index'), 10);
        }

        return index;
      }
    }
  },

  onRender: function() {
    this.ui.label.text(this.model.get('label'));
    this.model.get('options').forEach(this.addOption.bind(this));
  },

  addOption: function(option, index) {
    this.ui.menu.append('<li><a href="#" data-index="'+ index +'">' + option.label + '</a></li>');
  }
});
