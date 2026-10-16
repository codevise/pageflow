import {Base} from './Base';

export const SliderInput = Base.extend({
  startSliding: function() {
    this.$el.trigger('slidestart');
  },

  stopSliding: function() {
    this.$el.trigger('slidestop');
  }
});
