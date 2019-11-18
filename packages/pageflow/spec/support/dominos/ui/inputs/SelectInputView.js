import $ from 'jquery';

import {Base} from '../../Base';

export const SelectInputView = Base.extend({
  selector: 'select',

  values: function() {
    return this.$el.find('option').map(function() {
      return $(this).attr('value');
    }).get();
  }
});
