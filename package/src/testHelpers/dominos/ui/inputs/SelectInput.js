import $ from 'jquery';

import {Base} from './Base';

export const SelectInput = Base.extend({
  value: function() {
    return this.$el.find('select').val();
  },

  values: function() {
    return this.$el.find('option').map(function() {
      return $(this).attr('value');
    }).get();
  },

  enabledValues: function() {
    return this.$el.find('option:not([disabled])').map(function() {
      return $(this).attr('value');
    }).get();
  }
});
