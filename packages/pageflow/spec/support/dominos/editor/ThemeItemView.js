import _ from 'underscore';

import {Base} from '../Base';

export const ThemeItemView = Base.extend({
  selector: '.theme_item',

  hover: function() {
    this.$el.trigger('mouseenter');
  },

  click: function() {
    this.$el.trigger('click');
  },

  clickUseButton: function() {
    this.$el.find('.use_theme').trigger('click');
  }
});

ThemeItemView.findByName = function(themeName, options) {
  return this.findBy(function($el) {
    return $el.data('themeName') === themeName;
  }, _.extend({predicateName: 'theme name ' + themeName}, options));
};
