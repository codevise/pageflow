import {Base} from './Base';

export const SliderInput = Base.extend({
  displayedValue: function() {
    return this.$el.find('.value').text();
  },

  startSliding: function() {
    this.$el.trigger('slidestart');
  },

  stopSliding: function() {
    this.$el.trigger('slidestop');
  }
});
