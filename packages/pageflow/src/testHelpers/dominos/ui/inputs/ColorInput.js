import {Base} from '../../Base';

export const ColorInput = Base.extend({
  value: function() {
    return this._input().val();
  },

  fillIn: function(value, clock) {
    this._input().val(value);
    this._input().trigger('keyup');

    clock.tick(500);
  },

  swatches: function() {
    return this.$el.find('.minicolors-swatches span').map(function() {
      return window.getComputedStyle(this)['background-color'];
    }).get();
  },

  _input: function() {
    return this.$el.find('input');
  }
});
