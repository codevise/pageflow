support.dom.ThemeItemView = support.dom.Base.extend({
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

support.dom.ThemeItemView.findByName = function(themeName, options) {
  return this.findBy(function($el) {
    return $el.data('themeName') === themeName;
  }, _.extend({predicateName: 'theme name ' + themeName}, options));
};
