import $ from 'jquery';

import {Base} from './Base';

export const TransitionsInput = Base.extend({
  value: function() {
    return this.$el.find('input').val();
  },

  values: function() {
    return this.$el.find('input').map(function() {
      return $(this).attr('value');
    }).get();
  },

  enabledValues: function() {
    return this.$el.find('input:not([disabled])').map(function() {
      return $(this).attr('value');
    }).get();
  }
});
